import {
  CheckCircle,
  Clock3,
  Eye,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../redux/api/orderApi";

const tabs = [
  { id: "all", label: "All Requests", icon: <FileText size={14} /> },
  { id: "pending", label: "Pending", icon: <Clock3 size={14} /> },
  { id: "assigned", label: "Assigned", icon: <Clock3 size={14} /> },
  { id: "accepted", label: "Accepted", icon: <CheckCircle size={14} /> },
  { id: "cancelled", label: "Cancelled", icon: <XCircle size={14} /> },
];

const statusMap = {
  all: undefined,
  pending: "pending",
  assigned: "assigned",
  accepted: "accepted",
  cancelled: "cancelled",
};

export default function RequestOrder() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data } = useGetAllOrdersQuery({
    page: 1,
    limit: 10,
    status: statusMap[activeTab],
    searchTerm: search || undefined,
  });

  const orders = data?.data || [];

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#F3E8FF] text-[#7E22CE]";
      case "accepted":
        return "bg-[#D1FAE5] text-[#059669]";
      case "assigned":
        return "bg-[#DBEAFE] text-[#2563EB]";
      case "cancelled":
        return "bg-[#E5E7EB] text-[#6B7280]";
      default:
        return "bg-[#F3EDF9] text-[#374151]";
    }
  };

  const formatAmount = (order) => {
    if (order.orderType === "Vehicle") {
      return `$${(order.totalPrice || 0).toLocaleString()}`;
    }

    return `$${(order.subTotal || 0).toLocaleString()}`;
  };

  const getActionButton = (status) => {
    switch (status) {
      case "pending":
        return "Review & Send Offer";
      case "accepted":
        return "Assign Employee";
      case "assigned":
        return "View Details";
      default:
        return "View Details";
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getTimeAgo = (date) => {
    const diff = Math.floor((now - new Date(date).getTime()) / 60000);

    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;

    return `${Math.floor(diff / 1440)} days ago`;
  };

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
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-[#F3EDF9] text-[#374151] text-xs px-2 py-1 rounded-md font-medium">
                    {order.orderNumber}
                  </span>

                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    {order.customerName}
                  </h2>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>

                  <span className="bg-[#F3EDF9] text-[#374151] text-xs px-3 py-1 rounded-full">
                    {order.orderType}
                  </span>
                </div>

                <p className="text-[#111827] text-sm mt-4">
                  {order.orderType === "Vehicle"
                    ? `${order.model || "Vehicle"} ${order.year || ""}`
                    : order.items?.[0]?.name || "Metal"}
                </p>

                {order.vinNumber && (
                  <p className="text-xs text-[#9CA3AF] mt-2">
                    VIN: {order.vinNumber}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-xs text-[#9CA3AF]">
                  {getTimeAgo(order.createdAt)}
                </p>

                <p className="text-xs text-[#9CA3AF] mt-1">
                  {formatDate(order.createdAt)}
                </p>

                <h3 className="text-[28px] font-bold text-[#652D8B] mt-2">
                  {formatAmount(order)}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Eye size={16} />
                {order.attachments?.length || 0} images
              </div>

              <button
                className={`h-10 px-5 rounded-xl text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-[#652D8B] text-white"
                    : order.status === "accepted"
                      ? "bg-[#10B981] text-white"
                      : "bg-[#F3EDF9] text-[#111827]"
                }`}
              >
                {getActionButton(order.status)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
