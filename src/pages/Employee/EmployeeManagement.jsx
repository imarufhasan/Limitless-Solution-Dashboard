import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { Table } from "antd";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import {
  useGetAllEmployeesQuery,
  useGetEmployeeAnalyticsQuery,
} from "../../redux/api/employeeApi";

// ---------- Shimmer keyframe (injected once) ----------
if (
  typeof document !== "undefined" &&
  !document.getElementById("emp-shimmer-style")
) {
  const style = document.createElement("style");
  style.id = "emp-shimmer-style";
  style.textContent = `
    @keyframes empShimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

// ---------- Skeleton primitives ----------
function Sk({ className = "" }) {
  return (
    <div
      className={`rounded ${className}`}
      style={{
        background:
          "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
        backgroundSize: "200% 100%",
        animation: "empShimmer 1.4s infinite linear",
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

function TableSkeletonRows({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {/* Avatar */}
          <td className="px-4 py-3">
            <Sk className="w-10 h-10 rounded-full" />
          </td>
          {/* Name + email */}
          <td className="px-4 py-3">
            <Sk className="h-4 w-32 mb-2" />
            <Sk className="h-3 w-44" />
          </td>
          {/* Phone */}
          <td className="px-4 py-3">
            <Sk className="h-4 w-28" />
          </td>
          {/* Address */}
          <td className="px-4 py-3">
            <Sk className="h-4 w-24" />
          </td>
          {/* Completed Job */}
          <td className="px-4 py-3">
            <Sk className="h-4 w-10" />
          </td>
          {/* Role badge */}
          <td className="px-4 py-3">
            <Sk className="h-6 w-14 rounded-full" />
          </td>
          {/* Status badge */}
          <td className="px-4 py-3">
            <Sk className="h-6 w-20 rounded-full" />
          </td>
          {/* Active Jobs */}
          <td className="px-4 py-3">
            <Sk className="h-4 w-6" />
          </td>
        </tr>
      ))}
    </>
  );
}

const TABLE_HEADERS = [
  "#",
  "Employee Name",
  "Phone Number",
  "Address",
  "Completed Job",
  "Role",
  "Status",
  "Active Jobs",
];

// ---------- Avatar ----------
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=652D8B&color=fff&name=";

function EmployeeAvatar({ src, name }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallback = `${DEFAULT_AVATAR}${encodeURIComponent(name || "Employee")}`;
  const imgSrc = !src || error ? fallback : src;
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-4 h-4 border-2 border-[#652D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={name}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}

// ---------- Role badge ----------
function RoleBadge({ role }) {
  const styles =
    role === "admin"
      ? "bg-purple-100 text-[#652D8B]"
      : role === "staff"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-500";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles}`}
    >
      {role || "—"}
    </span>
  );
}

// ---------- Tab config ----------
const TABS = [
  { label: "All Employees", value: "" },
  { label: "Available", value: "available" },
  { label: "Busy", value: "busy" },
];

// ---------- Main page ----------
export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);

  // Analytics (stats cards)
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetEmployeeAnalyticsQuery();

  const analytics = analyticsData?.data || {};

  // Employee list
  const { data: employeeRes, isLoading: tableLoading } =
    useGetAllEmployeesQuery({
      page: currentPage,
      limit: 10,
      searchTerm: search,
      ...(activeTab ? { workingStatus: activeTab } : {}),
    });

  const employees = employeeRes?.data || [];
  const totalPages = employeeRes?.meta?.totalPages || 1;

  const handleSearch = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(window._empSearchTimer);
    window._empSearchTimer = setTimeout(() => {
      setSearch(val);
      setCurrentPage(1);
    }, 500);
  };

  const handleTabChange = (val) => {
    setActiveTab(val);
    setCurrentPage(1);
  };

  // Table columns
  const columns = [
    {
      title: "#",
      key: "avatar",
      width: 60,
      render: (_, record) => (
        <EmployeeAvatar src={record.profileImage} name={record.name} />
      ),
    },
    {
      title: "Employee Name",
      key: "name",
      render: (_, record) => (
        <div>
          <p className="text-sm font-medium text-[#111827]">
            {record.name || "—"}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">{record.email || "—"}</p>
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (val) => val || "—",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (val) => val || "—",
    },
    {
      title: "Completed Job",
      dataIndex: "completedJob",
      key: "completedJob",
      render: (val) => val ?? "—",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <RoleBadge role={role} />,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const isBusy = record.isBusy;
        const isBlocked = record.status === "blocked";
        const label = isBlocked ? "Blocked" : isBusy ? "Busy" : "Available";
        const styles = isBlocked
          ? "bg-red-100 text-red-600"
          : isBusy
            ? "bg-[#FEF3C7] text-[#D97706]"
            : "bg-[#DCFCE7] text-[#16A34A]";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: "Active Jobs",
      dataIndex: "ongoingJob",
      key: "ongoingJob",
      render: (val) => val ?? "—",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-semibold text-[#111827]">
            Employees
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage delivery partners and track performance
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-11 px-5 rounded-xl bg-[#652D8B] text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {analyticsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-[42px] font-bold text-[#111827] leading-none">
                {analytics.totalEmployee ?? "—"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3">Total Employees</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-[42px] font-bold text-[#111827] leading-none">
                {analytics.available ?? "—"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3">Available</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-[42px] font-bold text-[#111827] leading-none">
                {analytics.onDuty ?? "—"}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3">On Duty</p>
            </div>
          </>
        )}
      </div>

      {/* Search & Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-5">
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
          />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={inputValue}
            onChange={handleSearch}
            className="w-full h-11 rounded-xl bg-[#F9FAFB] border border-transparent focus:border-[#D1D5DB] outline-none pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`h-9 px-4 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB]">
        {tableLoading ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                <TableSkeletonRows rows={8} />
              </tbody>
            </table>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={employees}
            rowKey="_id"
            pagination={
              totalPages > 1
                ? {
                    current: currentPage,
                    total: employeeRes?.meta?.total || 0,
                    pageSize: 10,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false,
                  }
                : false
            }
            scroll={{ x: 1100 }}
            className="custom-employee-table"
          />
        )}
      </div>

      <AddEmployeeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
