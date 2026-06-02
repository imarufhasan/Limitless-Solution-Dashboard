import {
  CalendarDays,
  MapPin,
  Search,
  User,
} from "lucide-react";
import React, { useState } from "react";

const tabs = [
  "All Orders",
  "Assigned",
  "In Progress",
  "Completed",
];

const orders = [
  {
    id: "ORD001234",
    status: "Assigned",
    statusColor: "bg-[#DBEAFE] text-[#2563EB]",
    category: "Sell My Call",
    customer: "Vikram Singh",
    item: "Car",
    pickup: "89 HSR Layout, Bangalore",
    assignedTo: "Rahul Singh",
    amount: "$82,000",
  },
  {
    id: "ORD001234",
    status: "In Progress",
    statusColor: "bg-[#F3E8FF] text-[#9333EA]",
    category: "Metal Sell",
    customer: "Vikram Singh",
    item: "Car",
    pickup: "89 HSR Layout, Bangalore",
    assignedTo: "Rahul Singh",
    amount: "$82,000",
  },
  {
    id: "ORD001234",
    status: "Completed",
    statusColor: "bg-[#DCFCE7] text-[#16A34A]",
    category: "Sell My Call",
    customer: "Vikram Singh",
    item: "Car",
    pickup: "89 HSR Layout, Bangalore",
    assignedTo: "Rahul Singh",
    amount: "$82,000",
  },
];

export default function Order() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Orders");

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 md:p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[24px] font-semibold text-[#111827]">
          Orders
        </h1>

        <p className="text-sm text-[#6B7280] mt-1">
          Track and manage all pickup orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <h2 className="text-[42px] font-bold text-[#111827] leading-none">
            7
          </h2>

          <p className="text-sm text-[#6B7280] mt-3">
            Total Orders
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <h2 className="text-[42px] font-bold text-[#111827] leading-none">
            1
          </h2>

          <p className="text-sm text-[#6B7280] mt-3">
            In Progress
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <h2 className="text-[42px] font-bold text-[#111827] leading-none">
            2
          </h2>

          <p className="text-sm text-[#6B7280] mt-3">
            Completed
          </p>
        </div>
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
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11.5 rounded-xl bg-[#F9FAFB] border border-transparent focus:border-[#D1D5DB] outline-none pl-11 pr-4 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-9.5 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#6C2BD9] text-white"
                  : "bg-[#F3F4F6] text-[#111827]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
          >
            {/* Top */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              {/* Left Content */}
              <div className="flex-1">
                {/* Top Tags */}
                <div className="flex items-center gap-3 flex-wrap mb-5">
                  <span className="bg-[#F3EDF9] text-[#111827] text-xs font-medium px-3 py-1 rounded-md">
                    {order.id}
                  </span>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${order.statusColor}`}
                  >
                    {order.status}
                  </span>

                  <span className="bg-[#F3EDF9] text-[#374151] text-xs px-3 py-1 rounded-full">
                    {order.category}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Customer */}
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-2">
                      Customer
                    </p>

                    <div className="flex items-center gap-2">
                      <User
                        size={14}
                        className="text-[#6B7280]"
                      />

                      <h3 className="text-sm font-semibold text-[#111827]">
                        {order.customer}
                      </h3>
                    </div>

                    <p className="text-sm text-[#374151] mt-2">
                      {order.item}
                    </p>
                  </div>

                  {/* Pickup */}
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-2">
                      Pickup Location
                    </p>

                    <div className="flex items-center gap-2">
                      <MapPin
                        size={14}
                        className="text-[#6B7280]"
                      />

                      <h3 className="text-sm text-[#111827]">
                        {order.pickup}
                      </h3>
                    </div>
                  </div>

                  {/* Assigned */}
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-2">
                      Assigned To
                    </p>

                    <div className="flex items-center gap-2">
                      <User
                        size={14}
                        className="text-[#6B7280]"
                      />

                      <h3 className="text-sm font-semibold text-[#111827]">
                        {order.assignedTo}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Amount */}
              <div className="text-right">
                <p className="text-xs text-[#9CA3AF]">
                  Offer Amount
                </p>

                <h2 className="text-[34px] font-bold text-[#6C2BD9] mt-1">
                  {order.amount}
                </h2>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F3F4F6]">
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <CalendarDays size={15} />
                May 15, 2026
              </div>

              <button className="h-10 px-5 rounded-xl bg-[#F3EDF9] text-[#111827] text-sm font-medium hover:bg-[#ebe1f8] transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}