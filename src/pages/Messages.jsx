import React, { useState, useRef, useEffect } from "react";
import { Input, Avatar, Spin } from "antd";
import {
  SearchOutlined,
  SendOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import {
  useConversationQuery,
  useSupportConversationsQuery,
  useUploadAttachmentMutation,
} from "../redux/api/messageApi";
import { useSocket } from "../hooks/useSocket";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Emit join only when socket is confirmed connected
function joinRoom(getSocket, conversationId) {
  const socket = getSocket();
  if (!socket) return;

  if (socket.connected) {
    socket.emit("join_support", { conversationId });
    console.log("[Socket] 🚪 joined:", conversationId);
  } else {
    // Wait for connection then join
    socket.once("connect", () => {
      socket.emit("join_support", { conversationId });
      console.log("[Socket] 🚪 joined after connect:", conversationId);
    });
  }
}

export default function Messages() {
  const getSocket = useSocket(); // getter function — always fresh

  const [search, setSearch] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [socketMessages, setSocketMessages] = useState([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);
  const currentRoomRef = useRef(null);

  // ── REST ─────────────────────────────────────────────────

  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadAttachmentMutation();
  const fileInputRef = useRef(null);

  const { data: convoData, isLoading: convoLoading } =
    useSupportConversationsQuery();
  const conversations = convoData?.data || [];

  const filtered = conversations.filter((c) =>
    c.requesterName.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedConvo = conversations.find(
    (c) => c.conversationId === selectedConversationId,
  );

  const { data: msgData, isLoading: msgLoading } = useConversationQuery(
    selectedConversationId,
    { skip: !selectedConversationId },
  );

  const adminId = selectedConvo?.ownId;

  // Merge REST (oldest-first) + socket messages, dedupe by _id
  const restMessages = [...(msgData?.data?.messages || [])].reverse();
  const allMessages = [
    ...restMessages,
    ...socketMessages.filter(
      (sm) => !restMessages.some((rm) => rm._id === sm._id),
    ),
  ];

  // ── Auto-select first conversation ───────────────────────
  if (!initialized && conversations.length > 0) {
    setSelectedConversationId(conversations[0].conversationId);
    setInitialized(true);
  }

  // ── Auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isOtherTyping]);

  // ── Join / leave room when conversation changes ───────────
  useEffect(() => {
    if (!selectedConversationId) return;

    const socket = getSocket();
    if (!socket) return;

    // Leave previous room
    if (
      currentRoomRef.current &&
      currentRoomRef.current !== selectedConversationId
    ) {
      socket.emit("leave", { conversationId: currentRoomRef.current });
      console.log("[Socket] 🚶 left:", currentRoomRef.current);
    }

    // Join new room (waits for connection if needed)
    joinRoom(getSocket, selectedConversationId);
    currentRoomRef.current = selectedConversationId;

    // Reset on room switch
    setSocketMessages([]);
    setIsOtherTyping(false);

    return () => {
      const s = getSocket();
      if (s && currentRoomRef.current) {
        s.emit("leave", { conversationId: currentRoomRef.current });
      }
    };
  }, [selectedConversationId]);

  // ── Socket event listeners ────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (res) => {
      const msg = res?.data;
      if (!msg) return;
      if (msg.conversation !== selectedConversationId) return;

      const normalized = {
        _id: msg._id,
        messageId: msg._id,
        conversationId: msg.conversation,
        text: msg.text,
        attachments: msg.attachments || [],
        senderId: msg.sender,
        senderName: msg.senderName || "",
        senderProfileImge: msg.senderProfileImage || null,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      };

      setSocketMessages((prev) => {
        if (prev.some((m) => m._id === normalized._id)) return prev;
        return [...prev, normalized];
      });
    };

    const onTyping = (data) => {
      if (data?.userId === adminId) return;
      setIsOtherTyping(true);
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
    };

    socket.on("new_message", onNewMessage);
    socket.on("display_typing", onTyping);
    socket.emit("typing", onTyping);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("display_typing", onTyping);
      socket.off("typing", onTyping);
    };
  }, [selectedConversationId, adminId]);

  // ── Handlers ──────────────────────────────────────────────
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    const socket = getSocket();
    if (socket?.connected && selectedConversationId) {
      socket.emit("typing", { conversationId: selectedConversationId });
    }
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !selectedConversationId) return;

    const socket = getSocket();
    if (!socket?.connected) {
      console.warn("[Socket] not connected, cannot send");
      return;
    }

    socket.emit("send_message", {
      conversationId: selectedConversationId,
      message: text,
    });

    setInputText("");
  };

  const handleSelectConvo = (conversationId) => {
    if (conversationId === selectedConversationId) return; // no-op if same
    setSelectedConversationId(conversationId);
    setSocketMessages([]);
    setIsOtherTyping(false);
  };

  const handleAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedConversationId) return;
    e.target.value = "";

    try {
      const formData = new FormData();
      formData.append("attachment", file);
      const res = await uploadAttachment(formData).unwrap();
      const url = res?.data;
      if (!url) return;

      // Send the URL as a message via socket
      const socket = getSocket();
      if (!socket?.connected) return;
      socket.emit("send_message", {
        conversationId: selectedConversationId,
        message: url, // URL as message text
        attachments: [url], // also mark as attachment
      });
    } catch (err) {
      console.error("Attachment upload failed:", err);
    }
  };

  // Put this outside the component, near timeAgo
  const isImageUrl = (text) =>
    typeof text === "string" &&
    text.startsWith("http") &&
    /\.(png|jpg|jpeg|gif|webp)(\?|$)/i.test(text);

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-0.5">Messages</h2>
      <p className="text-xs text-gray-400 mb-4">
        Communicate with Customers and Employees
      </p>

      <div
        className="flex rounded-xl border border-gray-200 bg-white overflow-hidden"
        style={{ minHeight: 700 }}
      >
        {/* ── Left Sidebar ── */}
        <div className="w-64 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <Input
              prefix={
                <SearchOutlined style={{ color: "#9ca3af", fontSize: 13 }} />
              }
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bordered={false}
              className="bg-gray-50 rounded-lg"
              style={{ fontSize: 12 }}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {convoLoading ? (
              <div className="flex justify-center py-10">
                <Spin size="small" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">
                No conversations
              </div>
            ) : (
              filtered.map((convo) => {
                const isSelected =
                  selectedConversationId === convo.conversationId;
                const hasUnread = convo.unreadMessages > 0;

                return (
                  <div
                    key={convo.conversationId}
                    onClick={() => handleSelectConvo(convo.conversationId)}
                    className="flex items-center gap-2.5 px-3 py-3 cursor-pointer transition-colors border-b border-gray-50"
                    style={{
                      background: isSelected ? "#f3eafe" : "transparent",
                    }}
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        src={convo.requesterProfileImage || undefined}
                        size={38}
                        style={{
                          background: "#e9d5ff",
                          color: "#7c3aed",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {!convo.requesterProfileImage &&
                          convo.requesterName?.charAt(0).toUpperCase()}
                      </Avatar>
                      {hasUnread && (
                        <span
                          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center"
                          style={{ fontSize: 9, fontWeight: 700 }}
                        >
                          {convo.unreadMessages}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {convo.requesterName}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {timeAgo(convo.lastMessage?.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {convo.lastMessage?.text || "No messages yet"}
                      </p>
                      <span
                        className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: "#f3eafe",
                          color: "#7c3aed",
                          textTransform: "capitalize",
                        }}
                      >
                        {convo.requesterRole}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Chat Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedConvo ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                <Avatar
                  src={selectedConvo.requesterProfileImage || undefined}
                  size={36}
                  style={{
                    background: "#e9d5ff",
                    color: "#7c3aed",
                    fontWeight: 600,
                  }}
                >
                  {!selectedConvo.requesterProfileImage &&
                    selectedConvo.requesterName?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedConvo.requesterName}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {selectedConvo.requesterRole} ·{" "}
                    {selectedConvo.requesterEmail}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {msgLoading ? (
                  <div className="flex justify-center py-10">
                    <Spin />
                  </div>
                ) : allMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    No messages yet
                  </div>
                ) : (
                  allMessages.map((msg) => {
                    const fromMe = msg.senderId === adminId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${fromMe ? "items-end" : "items-start"}`}
                      >
                        {!fromMe && (
                          <span className="text-[11px] text-gray-400 mb-1 px-1">
                            {msg.senderName}
                          </span>
                        )}
                        <div className="flex items-end gap-2">
                          {!fromMe && (
                            <Avatar
                              src={msg.senderProfileImge || undefined}
                              size={26}
                              style={{
                                background: "#e9d5ff",
                                color: "#7c3aed",
                                fontSize: 11,
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {!msg.senderProfileImge &&
                                msg.senderName?.charAt(0).toUpperCase()}
                            </Avatar>
                          )}
                          <div
                            className="px-4 py-2.5 rounded-2xl max-w-sm"
                            style={{
                              background: fromMe ? "#7c3aed" : "#f3eafe",
                              color: fromMe ? "#fff" : "#1f2937",
                              borderBottomRightRadius: fromMe ? 4 : undefined,
                              borderBottomLeftRadius: !fromMe ? 4 : undefined,
                            }}
                          >
                            {isImageUrl(msg.text) ? (
                              <a
                                href={msg.text}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={msg.text}
                                  alt="attachment"
                                  className="rounded-xl max-w-55 max-h-45 object-cover cursor-pointer"
                                  style={{ display: "block" }}
                                />
                              </a>
                            ) : (
                              <p className="text-sm leading-relaxed">
                                {msg.text}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1 px-1">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator */}
                {isOtherTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar
                      src={selectedConvo.requesterProfileImage || undefined}
                      size={26}
                      style={{
                        background: "#e9d5ff",
                        color: "#7c3aed",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {!selectedConvo.requesterProfileImage &&
                        selectedConvo.requesterName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        background: "#f3eafe",
                        borderBottomLeftRadius: 4,
                      }}
                    >
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-400"
                            style={{
                              animation: "typingBounce 1.2s infinite",
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                  {/* <PaperClipOutlined
                    style={{
                      color: "#9ca3af",
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  /> */}

                  {/* hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleAttachment}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="disabled:opacity-40"
                  >
                    {isUploading ? (
                      <Spin size="small" />
                    ) : (
                      <PaperClipOutlined
                        style={{
                          color: "#9ca3af",
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </button>

                  <input
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type here..."
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                    style={{ background: "#7c3aed" }}
                  >
                    <SendOutlined style={{ color: "#fff", fontSize: 14 }} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              {convoLoading ? <Spin /> : "Select a conversation"}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
