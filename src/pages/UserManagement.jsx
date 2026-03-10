import { useState } from "react";
import { Search, } from "lucide-react";

import { Pagination } from "../components/Pagination";
import { Table, Avatar, Tag, Space, Button, Tooltip } from 'antd';
import { MailOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import RecentUsersTable from "../components/RecentUserTable/RecentUserTable";

export default function UserManagement() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);





const users = [
  {
    key: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    location: "123 Main St, New York",
    joined: "Jan 15, 2024",
    status: "Active",
  },
  {
    key: "2",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    location: "123 Main St, New York",
    joined: "Jan 15, 2024",
    status: "Suspended",
  },
  {
    key: "3",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    location: "123 Main St, New York",
    joined: "Jan 15, 2024",
    status: "Active",
  },
  {
    key: "4",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    location: "123 Main St, New York",
    joined: "Jan 15, 2024",
    status: "Active",
  },
  {
    key: "5",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    location: "123 Main St, New York",
    joined: "Jan 15, 2024",
    status: "Active",
  },
];



  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Users Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all platform users
          </p>
        </div>

      </div>

      {/* Search Bar  section */}
      <div className="flex items-center justify-center gap-5 mb-10 border p-2 rounded-md border-[#e1e2e6]">
        <div className="relative  group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={20}
              className="text-gray-400 group-focus-within:text-slate-600 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search by user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
          />
        </div>
        <div className="flex gap-5">
          <button className="bg-[#5B2EFF] text-white whitespace-nowrap px-4 py-2 rounded-lg">
            All Users
          </button>
          <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
            Active
          </button>
          <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
            Suspended
          </button>
        </div>

      </div>



     <RecentUsersTable users={users} />
      <div className="mt-5">
        <Pagination
          currentPage={currentPage}
          totalPages={2}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>




    </div>
  );
}

