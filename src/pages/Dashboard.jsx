import { useState, useEffect } from "react";
import {
  Users,
  ChevronDown,
  UserCheck,
  Monitor,
  UserRoundX,
  User2,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RecentUsersTable from "../components/RecentUserTable/RecentUserTable";
import BannerUploader from "../components/Banneruploader";
import { useGetDashboardAnalyticsQuery } from "../redux/api/dashboardApi";

const DashboardPage = () => {
  const currentYear = new Date().getFullYear();
  const { data, isLoading } = useGetDashboardAnalyticsQuery({
    purchaseGrowthYear: currentYear,
    customerGrowthYear: currentYear,
  });

  const dashboardData = data?.data;

  console.log(dashboardData);
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
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {

  };

  // --- API INTEGRATION ENDS HERE ---

  return (
    <div className="min-h-screen p-8 font-sans text-slate-800 ">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Monitor and analyse your MesseMatch application
          </p>
        </div>

      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">


        <>
          <StatCard
            title="Total Users"
            value={dashboardData?.summary?.totalUsers || 0}
            Icon={Users}
          />
          <StatCard
            title="Total Customers"
            value={dashboardData?.summary?.customer || 0}
            Icon={UserCheck}
          />
          <StatCard
            title="Total Employees"
            value={dashboardData?.summary?.staff || 0}
            Icon={User2}
          />
          <StatCard
            title="Total Metlas"
            value={dashboardData?.summary?.totalMetals || 0}
            Icon={TrendingUp}
          />
        </>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <IndependentChartCard
          title="Monthly Customer Growth"
          type="book"
          dataKey="bookGrowth"
          chartType="area"
        />
        <IndependentChartCard
          title="Monthly Purchase Overview"
          type="blog"
          dataKey="blogGrowth"
          chartType="bar"
        />
      </div>


      {/* Recent Users Table */}
      <div>
        <BannerUploader />
      </div>

    </div>
  );
};

// ... Rest of your existing components (IndependentChartCard, StatCard, Skeletons) remain exactly the same
const IndependentChartCard = ({ title, type, dataKey, chartType }) => {


  const STATIC_DASHBOARD_DATA = {
    2024: [
      { month: "January", count: 120 },
      { month: "February", count: 90 },
      { month: "March", count: 150 },
      { month: "April", count: 110 },
      { month: "May", count: 170 },
      { month: "June", count: 140 },
      { month: "July", count: 180 },
      { month: "August", count: 160 },
      { month: "September", count: 130 },
      { month: "October", count: 190 },
      { month: "November", count: 200 },
      { month: "December", count: 220 },
    ],
    2025: [
      { month: "January", count: 100 },
      { month: "February", count: 80 },
      { month: "March", count: 140 },
      { month: "April", count: 120 },
      { month: "May", count: 160 },
      { month: "June", count: 150 },
      { month: "July", count: 170 },
      { month: "August", count: 155 },
      { month: "September", count: 145 },
      { month: "October", count: 175 },
      { month: "November", count: 185 },
      { month: "December", count: 210 },
    ],
    2026: [
      { month: "January", count: 130 },
      { month: "February", count: 95 },
      { month: "March", count: 160 },
      { month: "April", count: 140 },
      { month: "May", count: 180 },
      { month: "June", count: 165 },
      { month: "July", count: 190 },
      { month: "August", count: 175 },
      { month: "September", count: 155 },
      { month: "October", count: 200 },
      { month: "November", count: 215 },
      { month: "December", count: 240 },
    ],
  };

  const [year, setYear] = useState(2026);


  const startYear = 2024;
  const endYear = 2050;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );



  const chartData =
    STATIC_DASHBOARD_DATA?.[year]?.map((item) => ({
      name: item.month.substring(0, 3),
      count: item.count,
    })) || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative transition-all hover:shadow-md group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-900 transition-colors">
          {title}
        </h3>

        <div className="relative group/select">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 transition-all duration-200 hover:border-slate-400 hover:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-900 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 border-r border-slate-200 pr-2">
              Year
            </span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none bg-transparent outline-none text-xs font-bold text-slate-800 cursor-pointer z-10"
            >
              {years.map((y) => (
                <option key={y} value={y} className="text-base">
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#652D8B] group-hover/select:text-[#652D8B] transition-colors">
              <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {/* {isFetching ? (
          <SkeletonChart />
        ) : ( */}
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`color${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#652D8B" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#652D8B" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#652D8B"
                strokeWidth={3}
                fill={`#652D8B`}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#652D8B" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#652D8B" }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#652D8B"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
        {/* )} */}

      </div>

    </div>
  );
};

const StatCard = ({ title, value, Icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-5 items-start transition-all hover:shadow-md hover:-translate-y-1 group">
    <div className="p-3 bg-[#F0EAF3] rounded-xl border border-slate-100  group-hover:text-white transition-all duration-300">
      <Icon size={22} className="text-[#652D8B]" />
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 leading-tight">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">
        {value}
      </h3>
    </div>

  </div>
);

const SkeletonStatCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-slate-100 rounded"></div>
        <div className="h-8 w-12 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-12 w-12 bg-slate-100 rounded-xl"></div>
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="w-full h-full flex flex-col justify-end gap-4 animate-pulse pt-4">
    <div className="flex items-end justify-between gap-2 h-full px-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-100 w-full rounded-t-md"
          style={{ height: `${Math.random() * 60 + 20}%` }}
        ></div>
      ))}
    </div>
    <div className="h-4 w-full bg-slate-50 rounded"></div>
  </div>
);

export default DashboardPage;
