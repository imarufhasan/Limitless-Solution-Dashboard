import React, { useState, useRef, useEffect } from "react";
import { Input, Avatar, Spin } from "antd";
import {
  SearchOutlined,
  SendOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useConversationQuery, useSupportConversationsQuery } from "../redux/api/messageApi";


function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Messages() {
  const [search, setSearch] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef(null);

  // ── Conversation list ──────────────────────────────────
  const { data: convoData, isLoading: convoLoading } =
    useSupportConversationsQuery();
  const conversations = convoData?.data || [];

  const filtered = conversations.filter((c) =>
    c.requesterName.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedConvo = conversations.find(
    (c) => c.conversationId === selectedConversationId,
  );

  // ── Messages for selected conversation ────────────────
  const { data: msgData, isLoading: msgLoading } = useConversationQuery(
    selectedConversationId,
    { skip: !selectedConversationId },
  );

  const messages = msgData?.data?.messages || [];
  const adminId = selectedConvo?.ownId;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select first conversation
  const [initialized, setInitialized] = useState(false);
  if (!initialized && conversations.length > 0) {
    setSelectedConversationId(conversations[0].conversationId);
    setInitialized(true);
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    setInputText("");
  };

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
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <Input
              prefix={
                <SearchOutlined style={{ color: "#9ca3af", fontSize: 13 }} />
              }
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bordered={false}
              className="bg-gray-50 rounded-lg text-sm"
              style={{ fontSize: 12 }}
            />
          </div>

          {/* Contact List */}
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
                    onClick={() =>
                      setSelectedConversationId(convo.conversationId)
                    }
                    className="flex items-center gap-2.5 px-3 py-3 cursor-pointer transition-colors border-b border-gray-50"
                    style={{
                      background: isSelected ? "#f3eafe" : "transparent",
                    }}
                  >
                    {/* Avatar */}
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

                    {/* Info */}
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
              {/* Chat Header */}
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
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    No messages yet
                  </div>
                ) : (
                  // Messages come newest-first from API, so reverse to show oldest first
                  [...messages].reverse().map((msg) => {
                    const fromMe = msg.senderId === adminId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${fromMe ? "items-end" : "items-start"}`}
                      >
                        {/* Sender name for received messages */}
                        {!fromMe && (
                          <span className="text-[11px] text-gray-400 mb-1 px-1">
                            {msg.senderName}
                          </span>
                        )}

                        <div className="flex items-end gap-2">
                          {/* Avatar for received */}
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
                            <p className="text-sm leading-relaxed">
                              {msg.text}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] text-gray-400 mt-1 px-1">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                  <PaperClipOutlined
                    style={{
                      color: "#9ca3af",
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  />
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type here..."
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                  <button
                    onClick={handleSend}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
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
    </div>
  );
}
