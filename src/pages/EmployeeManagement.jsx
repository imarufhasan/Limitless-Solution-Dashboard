import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { Table } from "antd";
import AddEmployeeModal from "../components/AddEmployeeModal";


const employeeData = [
  {
    key: 1,
    avatar: "https://i.pravatar.cc/100?img=1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    address: "123 Main Street, Dhaka",
    completedJob: 156,
    status: "Available",
    active: 0,
  },
  {
    key: 2,
    avatar: "https://i.pravatar.cc/100?img=2",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    address: "123 Main Street, Dhaka",
    completedJob: 200,
    status: "Available",
    active: 0,
  },
  {
    key: 3,
    avatar: "https://i.pravatar.cc/100?img=3",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    address: "123 Main Street, Dhaka",
    completedJob: 630,
    status: "Available",
    active: 0,
  },
  {
    key: 4,
    avatar: "https://i.pravatar.cc/100?img=4",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    address: "123 Main Street, Dhaka",
    completedJob: 253,
    status: "Busy",
    active: 5,
  },
  {
    key: 5,
    avatar: "https://i.pravatar.cc/100?img=5",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    address: "123 Main Street, Dhaka",
    completedJob: 120,
    status: "Busy",
    active: 11,
  },
];

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [open, setOpen] = useState(false);

  const columns = [
    {
      title: "#",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (_, record) => (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={record.avatar}
            alt="employee"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },

    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div>
          <h3 className="text-sm font-medium text-[#111827]">
            {record.name}
          </h3>

          <p className="text-xs text-[#6B7280] mt-1">
            {record.email}
          </p>
        </div>
      ),
    },

    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Completed Job",
      dataIndex: "completedJob",
      key: "completedJob",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${status === "Available"
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FEF3C7] text-[#D97706]"
            }`}
        >
          {status}
        </span>
      ),
    },

    {
      title: "Active",
      dataIndex: "active",
      key: "active",
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

        <button  onClick={() => setOpen(true)} className="h-11 px-5 rounded-xl bg-[#652D8B] text-white text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Add New Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <h2 className="text-[42px] font-bold text-[#111827] leading-none">
            50
          </h2>

          <p className="text-sm text-[#6B7280] mt-3">
            Total Employees
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <h2 className="text-[42px] font-bold text-[#111827] leading-none">
            30
          </h2>

          <p className="text-sm text-[#6B7280] mt-3">
            Available
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <h2 className="text-[42px] font-bold text-[#111827] leading-none">
            20
          </h2>

          <p className="text-sm text-[#6B7280] mt-3">
            On Duty
          </p>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("all")}
            className={`h-9.5 px-4 rounded-xl text-sm font-medium ${activeTab === "all"
                ? "bg-[#652D8B] text-white"
                : "bg-[#F3F4F6] text-[#111827]"
              }`}
          >
            All Employees
          </button>

          <button
            onClick={() => setActiveTab("available")}
            className={`h-9.5 px-4 rounded-xl text-sm font-medium ${activeTab === "available"
                ? "bg-[#652D8B] text-white"
                : "bg-[#F3F4F6] text-[#111827]"
              }`}
          >
            Available
          </button>

          <button
            onClick={() => setActiveTab("busy")}
            className={`h-9.5 px-4 rounded-xl text-sm font-medium ${activeTab === "busy"
                ? "bg-[#652D8B] text-white"
                : "bg-[#F3F4F6] text-[#111827]"
              }`}
          >
            Busy
          </button>
        </div>
      </div>

      {/* Ant Design Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB]">
        <Table
          columns={columns}
          dataSource={employeeData}
          pagination={false}
          scroll={{ x: 1000 }}
          className="custom-employee-table"
        />
      </div>

      <AddEmployeeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}