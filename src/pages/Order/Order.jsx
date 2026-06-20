import {
  CalendarDays,
  MapPin,
  Search,
  User,
  Package,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useGetOrderAnalyticsQuery,
} from "../../redux/api/orderApi";

if (
  typeof document !== "undefined" &&
  !document.getElementById("order-shimmer-style")
) {
  const s = document.createElement("style");
  s.id = "order-shimmer-style";
  s.textContent = `
    @keyframes orderShimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(s);
}

function Sk({ className = "", style = {} }) {
  return (
    <div
      className={`rounded ${className}`}
      style={{
        background:
          "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)",
        backgroundSize: "200% 100%",
        animation: "orderShimmer 1.4s infinite linear",
        ...style,
      }}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <Sk className="h-10 w-16 mb-3" />
      <Sk className="h-4 w-28" />
    </div>
  );
}

function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-5">
            <Sk className="h-6 w-36 rounded-md" />
            <Sk className="h-6 w-20 rounded-full" />
            <Sk className="h-6 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <Sk className="h-3 w-16 mb-3" />
                <Sk className="h-4 w-28 mb-2" />
                <Sk className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <Sk className="h-3 w-20 mb-2 ml-auto" />
          <Sk className="h-10 w-28 ml-auto" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
        <Sk className="h-4 w-28" />
        <Sk className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

const TABS = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function statusStyle(status = "") {
  const s = status.toLowerCase();
  if (s === "assigned") return "bg-[#DBEAFE] text-[#2563EB]";
  if (s === "in-progress" || s === "in progress")
    return "bg-[#F3E8FF] text-[#9333EA]";
  if (s === "completed") return "bg-[#DCFCE7] text-[#16A34A]";
  if (s === "pending") return "bg-[#FEF9C3] text-[#CA8A04]";
  if (s === "cancelled") return "bg-[#FEE2E2] text-[#DC2626]";
  return "bg-[#F3F4F6] text-[#374151]";
}

function statusLabel(status = "") {
  const map = { "in-progress": "In Progress" };
  return (
    map[status.toLowerCase()] ??
    status.charAt(0).toUpperCase() + status.slice(1)
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

function itemsSummary(items = []) {
  if (!items.length) return "—";
  if (items.length === 1) {
    const i = items[0];
    return `${i.name} — ${i.quantity} ${i.unit} @ $${i.price}/${i.unit}`;
  }
  return items.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(", ");
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function EmptyState({ message = "No orders found" }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-full bg-[#F3EDF9] flex items-center justify-center mb-4">
        <CalendarDays size={24} className="text-[#652D8B]" />
      </div>
      <p className="text-[#111827] font-medium mb-1">{message}</p>
      <p className="text-sm text-[#6B7280]">
        Try adjusting your search or filter
      </p>
    </div>
  );
}

function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-[#6B7280]">
        Showing {Math.min((current - 1) * pageSize + 1, total)}–
        {Math.min(current * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="h-9 px-4 rounded-xl text-sm font-medium bg-[#F3F4F6] text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E9EBF0] transition-all"
        >
          Prev
        </button>
        <span className="text-sm text-[#6B7280]">
          {current} / {totalPages}
        </span>
        <button
          disabled={current === totalPages}
          onClick={() => onChange(current + 1)}
          className="h-9 px-4 rounded-xl text-sm font-medium bg-[#F3F4F6] text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E9EBF0] transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Order() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: res,
    isLoading,
    isError,
  } = useGetAllOrdersQuery({
    page: currentPage,
    limit: 10,
    ...(activeTab ? { status: activeTab } : {}),
    ...(search ? { searchTerm: search } : {}),
  });

  const { data: analyticsRes, isLoading: analyticsLoading } =
    useGetOrderAnalyticsQuery();

  const orders = res?.data || [];
  const meta = res?.meta || {};
  const totalCount = meta.total || 0;

  const analytics = analyticsRes?.data || {};

  const handleSearch = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(window._orderSearchTimer);
    window._orderSearchTimer = setTimeout(() => {
      setSearch(val);
      setCurrentPage(1);
    }, 500);
  };

  const handleTabChange = (val) => {
    setActiveTab(val);
    setCurrentPage(1);
  };

  const statsLoading = isLoading || analyticsLoading;

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-[#111827]">Orders</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Track and manage all pickup orders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-[42px] font-bold text-[#111827] leading-none">
                {analytics.totalOrder ?? "—"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3">Total Orders</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-[42px] font-bold text-[#111827] leading-none">
                {analytics.completed ?? "—"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3">Completed</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-[42px] font-bold text-[#111827] leading-none">
                {analytics.cancelled ?? "—"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3">Cancelled</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-5">
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={inputValue}
            onChange={handleSearch}
            className="w-full h-11 rounded-xl bg-[#F9FAFB] border border-transparent focus:border-[#D1D5DB] outline-none pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === value
                  ? "bg-[#652D8B] text-white"
                  : "bg-[#F3F4F6] text-[#111827]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState message="Failed to load orders. Please try again." />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.orderId || index}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-5">
                      <span className="bg-[#F3EDF9] text-[#652D8B] text-xs font-semibold px-3 py-1 rounded-md font-mono tracking-wide">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle(order.status)}`}
                      >
                        {statusLabel(order.status)}
                      </span>
                      <span className="bg-[#F3EDF9] text-[#374151] text-xs px-3 py-1 rounded-full">
                        {order.orderType}
                      </span>
                      <DeliveryBadge type={order.deliveryType} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <p className="text-xs text-[#9CA3AF] mb-2">Customer</p>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-[#6B7280]" />
                          <h3 className="text-sm font-semibold text-[#111827]">
                            {order.customerName}
                          </h3>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {order.customerEmail}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {order.customerPhoneNumber}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#9CA3AF] mb-2">
                          {order.deliveryType === "pickup"
                            ? "Pickup Address"
                            : "Customer Address"}
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={14}
                            className="text-[#6B7280] mt-0.5 shrink-0"
                          />
                          <p className="text-sm text-[#111827]">
                            {order.pickupAddress ||
                              order.customerAddress ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#9CA3AF] mb-2">
                          {order.orderType === "Vehicle"
                            ? "VIN Number"
                            : "Items"}
                        </p>
                        {order.orderType === "Vehicle" ? (
                          <p className="text-sm font-mono text-[#111827]">
                            {order.vinNumber || "—"}
                          </p>
                        ) : (
                          <p className="text-sm text-[#111827]">
                            {itemsSummary(order.items)}
                          </p>
                        )}
                        {order.additionalNotes && (
                          <p
                            className="text-xs text-[#9CA3AF] mt-1 italic truncate max-w-45"
                            title={order.additionalNotes}
                          >
                            "{order.additionalNotes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-[#9CA3AF]">Sub Total</p>
                    <h2 className="text-[34px] font-bold text-[#652D8B] mt-1 leading-none">
                      ${Number(order.subTotal).toLocaleString()}
                    </h2>
                    <p className="text-xs text-[#9CA3AF] mt-2">
                      Preferred date
                    </p>
                    <p className="text-sm text-[#374151] font-medium mt-0.5">
                      {fmtDate(order.preferredDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <CalendarDays size={15} />
                    {fmtDate(order.createdAt)}
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/order-details/${order.orderId}?from=order`)
                    }
                    className="h-10 px-5 rounded-xl bg-[#F3EDF9] text-[#111827] text-sm font-medium hover:bg-[#ebe1f8] transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            current={currentPage}
            total={totalCount}
            pageSize={10}
            onChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
