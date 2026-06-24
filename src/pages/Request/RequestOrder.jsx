import {
  CheckCircle,
  Clock3,
  Eye,
  FileText,
  Search,
  XCircle,
  Truck,
  Package,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../redux/api/orderApi";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "all", label: "All Requests", icon: <FileText size={14} /> },
  { id: "pending", label: "Pending", icon: <Clock3 size={14} /> },
  { id: "accepted", label: "Accepted", icon: <CheckCircle size={14} /> },
  { id: "assigned", label: "Assigned", icon: <Clock3 size={14} /> },
  { id: "cancelled", label: "Cancelled", icon: <XCircle size={14} /> },
];

const statusMap = {
  all: undefined,
  pending: "pending",
  accepted: "accepted",
  assigned: "assigned",
  cancelled: "cancelled",
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="h-6 w-24 bg-gray-200 rounded-md" />
            <div className="h-6 w-32 bg-gray-200 rounded-md" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 w-40 bg-gray-200 rounded mt-4" />
          <div className="h-3 w-28 bg-gray-100 rounded mt-2" />
        </div>
        <div className="text-right ml-4">
          <div className="h-3 w-20 bg-gray-100 rounded ml-auto" />
          <div className="h-3 w-16 bg-gray-100 rounded mt-2 ml-auto" />
          <div className="h-8 w-28 bg-gray-200 rounded mt-2 ml-auto" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
        <div className="h-4 w-20 bg-gray-100 rounded" />
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ search, activeTab }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
      <div className="w-14 h-14 bg-[#F3EDF9] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText size={24} className="text-[#652D8B]" />
      </div>
      <h3 className="text-[#111827] font-semibold text-base mb-1">
        No requests found
      </h3>
      <p className="text-[#6B7280] text-sm">
        {search
          ? `No results for "${search}". Try a different name.`
          : `There are no ${activeTab === "all" ? "" : activeTab} requests yet.`}
      </p>
    </div>
  );
}

function DeliveryBadge({ type }) {
  const isPickup = type === "pickup";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${
        isPickup ? "bg-[#E0F2FE] text-[#0369A1]" : "bg-[#F0FDF4] text-[#15803D]"
      }`}
    >
      {isPickup ? <Truck size={11} /> : <Package size={11} />}
      {isPickup ? "Pickup" : "Drop-off"}
    </span>
  );
}

export default function RequestOrder() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

const { data, isLoading, isFetching } = useGetAllOrdersQuery(
  {
    page,
    limit,
    status: statusMap[activeTab],
    searchTerm: debouncedSearch || undefined,
  },
  { refetchOnMountOrArgChange: true } 
);

  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? data?.pagination?.total ?? 0;
  //  const totalPages = Math.ceil(total / limit);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const showSkeleton = isLoading || isFetching;
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
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
        return "bg-red-500 text-white";
      default:
        return "bg-[#F3EDF9] text-[#374151]";
    }
  };

  const formatAmount = (order) =>
    order.orderType === "Vehicle"
      ? `$${(order.totalPrice || 0).toLocaleString()}`
      : `$${(order.totalPrice || 0).toLocaleString()}`;

  const getActionButton = (order) => {
    if (order.status === "pending") {
      return "Review & Send Offer";
    }
    if (
      order.status === "accepted" &&
      order.orderType === "Vehicle" &&
      order.deliveryType === "pickup"
    ) {
      return "Assign Employee";
    }
    return "View Details";
  };

  const getActionStyle = (order) => {
    if (order.status === "pending") {
      return "bg-[#652D8B] text-white";
    }

    if (
      order.status === "accepted" &&
      order.orderType === "Vehicle" &&
      order.deliveryType === "pickup"
    ) {
      return "bg-[#10B981] text-white";
    }

    return "bg-[#F3EDF9] text-[#111827]";
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
    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-[#111827]">
          Quote Requests
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage and review all scrap pickup quote requests
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-5">
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

        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
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

      <div className="space-y-4">
        {showSkeleton ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : orders.length === 0 ? (
          <EmptyState search={debouncedSearch} activeTab={activeTab} />
        ) : (
          orders.map((order) => (
            <div
              key={order._id ?? order.orderId}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-[#F3EDF9] text-[#374151] text-xs px-2 py-1 rounded-md font-medium shrink-0">
                      {order.orderNumber}
                    </span>
                    <h2 className="text-[18px] font-semibold text-[#111827] truncate">
                      {order.customerName}
                    </h2>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <span className="bg-[#F3EDF9] text-[#374151] text-xs px-3 py-1 rounded-full shrink-0">
                      {order.orderType}
                    </span>

                    <DeliveryBadge type={order.deliveryType} />
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

                <div className="text-right ml-4 shrink-0">
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
                  className={`h-10 px-5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 ${getActionStyle(order)}`}
                  onClick={() =>
                    navigate(`/order-details/${order.orderId}?from=request`)
                  }
                >
                  {getActionButton(order)}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!showSkeleton && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-9 px-4 rounded-xl text-sm font-medium bg-white border border-[#E5E7EB] text-[#374151] disabled:opacity-40 hover:border-[#652D8B] transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="text-[#9CA3AF] text-sm px-1"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-[#652D8B] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#652D8B]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-9 px-4 rounded-xl text-sm font-medium bg-white border border-[#E5E7EB] text-[#374151] disabled:opacity-40 hover:border-[#652D8B] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
