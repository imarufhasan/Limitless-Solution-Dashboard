import React, { useState, useRef, useEffect } from "react";
import { Input, Avatar, Badge } from "antd";
import { SearchOutlined, SendOutlined, PaperClipOutlined } from "@ant-design/icons";

const customers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Customer",
    date: "2025-01-10",
    avatar: "https://i.pravatar.cc/40?img=47",
    messages: [
      { id: 1, text: "Hi Admin", time: "2025-01-10 10:20am", fromMe: false },
      { id: 2, text: "How Can I Help You", time: "2025-01-10 10:20am", fromMe: true },
    ],
  },
  {
    id: 2,
    name: "Doe Johnson",
    role: "Customer",
    date: "2025-01-10",
    avatar: "https://i.pravatar.cc/40?img=12",
    messages: [
      { id: 1, text: "Hello!", time: "2025-01-10 09:00am", fromMe: false },
    ],
  },
];

const employees = [
  {
    id: 3,
    name: "Alex Smith",
    role: "Employee",
    date: "2025-01-09",
    avatar: "https://i.pravatar.cc/40?img=33",
    messages: [
      { id: 1, text: "Good morning!", time: "2025-01-09 08:30am", fromMe: false },
    ],
  },
];

export default function Messages() {
  const [tab, setTab] = useState("Customer");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState({ ...Object.fromEntries([...customers, ...employees].map(u => [u.id, u.messages])) });
  const bottomRef = useRef(null);

  const list = tab === "Customer" ? customers : employees;
  const filtered = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  const selected = [...customers, ...employees].find(u => u.id === selectedId);
  const messages = chats[selectedId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: inputText.trim(),
      time: new Date().toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      fromMe: true,
    };
    setChats(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), newMsg] }));
    setInputText("");
  };

  return (
    <div className="p-6 ">
      <h2 className="text-base font-semibold text-gray-900 mb-0.5">Messages</h2>
      <p className="text-xs text-gray-400 mb-4">Communicate with Customers and Employee</p>

      <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ minHeight: 700 }}>
        {/* Left Sidebar */}
        <div className="w-48 border-r border-gray-100 flex flex-col shrink-0">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <Input
              prefix={<SearchOutlined style={{ color: "#9ca3af", fontSize: 13 }} />}
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              bordered={false}
              className="bg-gray-50 rounded-lg text-sm"
              style={{ fontSize: 12 }}
            />
          </div>

          {/* Tabs */}
          <div className="flex m-3 rounded-lg overflow-hidden border border-purple-200 bg-white">
            {["Customer", "Employee"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); }}
                className="flex-1 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: tab === t ? "#7c3aed" : "transparent",
                  color: tab === t ? "#fff" : "#7c3aed",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedId(user.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors"
                style={{
                  background: selectedId === user.id ? "#f3eafe" : "transparent",
                }}
              >
                <Avatar src={user.avatar} size={34} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                  <p className="text-xs text-gray-400">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                <Avatar src={selected.avatar} size={36} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{selected.name}</p>
                  <p className="text-xs text-gray-400">{selected.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}>
                    <div
                      className="px-4 py-2.5 rounded-2xl max-w-xs"
                      style={{
                        background: msg.fromMe ? "#7c3aed" : "#f3eafe",
                        color: msg.fromMe ? "#fff" : "#1f2937",
                        borderBottomRightRadius: msg.fromMe ? 4 : undefined,
                        borderBottomLeftRadius: !msg.fromMe ? 4 : undefined,
                      }}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                  <PaperClipOutlined style={{ color: "#9ca3af", fontSize: 15, cursor: "pointer" }} />
                  <input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
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
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}