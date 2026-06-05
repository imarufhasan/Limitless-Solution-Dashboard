import {
  CheckCircle,
  Clock3,
  Eye,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

const tabs = [
  {
    id: "all",
    label: "All Requests",
    icon: <FileText size={14} />,
  },
  {
    id: "pending",
    label: "Pending",
    icon: <Clock3 size={14} />,
  },
  {
    id: "offer",
    label: "Offer Sent",
    icon: <Clock3 size={14} />,
  },
  {
    id: "accepted",
    label: "Accepted",
    icon: <CheckCircle size={14} />,
  },
  {
    id: "rejected",
    label: "Rejected",
    icon: <XCircle size={14} />,
  },
];

const orders = [
  {
    id: "#000002",
    name: "Priya Sharma",
    status: "Pending",
    statusColor: "bg-[#F3E8FF] text-[#7E22CE]",
    category: "Metal Sell",
    item: "Car",
    vin: "2HGBH41JXMN109187",
    time: "15 min ago",
    date: "May 15, 2026",
    amount: "$32,000",
    button: "Review & Send Offer",
    buttonColor: "bg-[#652D8B] text-white",
  },
  {
    id: "#000003",
    name: "Amit Patel",
    status: "Offer Sent",
    statusColor: "bg-[#DBEAFE] text-[#2563EB]",
    category: "Sell My Call",
    item: "Car",
    vin: "2HGBH41JXMN109187",
    time: "45 min ago",
    date: "May 15, 2026",
    amount: "$2,000",
    button: "View Details",
    buttonColor: "bg-[#F3EDF9] text-[#111827]",
  },
  {
    id: "#000003",
    name: "Amit Patel",
    status: "Accepted",
    statusColor: "bg-[#D1FAE5] text-[#059669]",
    category: "Sell My Call",
    item: "Car / Sell My Call",
    vin: "2HGBH41JXMN109187",
    time: "3 hours ago",
    date: "May 15, 2026",
    amount: "$2,000",
    button: "View Details",
    secondButton: "Assign Employee",
    buttonColor: "bg-[#F3EDF9] text-[#111827]",
    secondButtonColor: "bg-[#10B981] text-white",
  },
  {
    id: "#000004",
    name: "Meera Iyer",
    status: "Rejected",
    statusColor: "bg-[#E5E7EB] text-[#6B7280]",
    category: "Sell My Call",
    item: "Car",
    vin: "2HGBH41JXMN109187",
    time: "5 hours ago",
    date: "May 15, 2026",
    amount: "$500",
    button: "View Details",
    buttonColor: "bg-[#F3EDF9] text-[#111827]",
  },
];

export default function RequestOrder() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[22px] font-semibold text-[#111827]">
          Quote Requests
        </h1>

        <p className="text-sm text-[#6B7280] mt-1">
          Manage and review all scrap pickup quote requests
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by customer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-[#F9FAFB] rounded-xl border border-transparent focus:border-[#D1D5DB] outline-none pl-11 pr-4 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 px-5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-[#652D8B] text-white"
                  : "bg-[#F9FAFB] text-[#111827]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between">
              {/* Left */}
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-[#F3EDF9] text-[#374151] text-xs px-2 py-1 rounded-md font-medium">
                    {order.id}
                  </span>

                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    {order.name}
                  </h2>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${order.statusColor}`}
                  >
                    {order.status}
                  </span>

                  <span className="bg-[#F3EDF9] text-[#374151] text-xs px-3 py-1 rounded-full">
                    {order.category}
                  </span>
                </div>

                <p className="text-[#111827] text-sm mt-4">{order.item}</p>

                <p className="text-xs text-[#9CA3AF] mt-2">
                  VIN: {order.vin}
                </p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-xs text-[#9CA3AF]">{order.time}</p>

                <p className="text-xs text-[#9CA3AF] mt-1">
                  {order.date}
                </p>

                <h3 className="text-[28px] font-bold text-[#652D8B] mt-2">
                  {order.amount}
                </h3>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Eye size={16} />
                4 images
              </div>

              <div className="flex items-center gap-3">
                {order.secondButton && (
                  <button
                    className={`h-10.5 px-5 rounded-xl text-sm font-medium ${order.secondButtonColor}`}
                  >
                    {order.secondButton}
                  </button>
                )}

                <button
                  className={`h-10.5 px-5 rounded-xl text-sm font-medium ${order.buttonColor}`}
                >
                  {order.button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}