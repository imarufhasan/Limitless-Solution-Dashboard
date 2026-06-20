import { useState } from "react";
import { Search } from "lucide-react";
import { Pagination } from "../components/Pagination";
import RecentUsersTable from "../components/RecentUserTable/RecentUserTable";
import { useGetAllUsersQuery } from "../redux/api/profileApi";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState("");

  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: 10,
    searchTerm,
    status: activeStatus,
  });

  const users = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleSearch = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => {
      setSearchTerm(val);
      setCurrentPage(1);
    }, 500);
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white font-sans text-slate-800 flex flex-col h-screen">
      {/* HEADER (fixed area) */}
      <div className="pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Users Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and monitor all platform users
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 mb-6 border p-2 rounded-md border-[#e1e2e6]">
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Search by user..."
            value={inputValue}
            onChange={handleSearch}
            className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl outline-none"
          />
        </div>

        <div className="flex gap-5">
          {[
            { label: "All Users", value: "" },
            { label: "Active", value: "active" },
            { label: "Blocked", value: "blocked" },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => handleStatusFilter(value)}
              className={`px-4 py-2 rounded-lg ${
                activeStatus === value
                  ? "bg-[#652D8B] text-white"
                  : "bg-[#E8ECEF] text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <RecentUsersTable users={users} isLoading={isLoading} />

        <div className="mt-5 pb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
