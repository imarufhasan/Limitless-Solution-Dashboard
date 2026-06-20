import { useState } from "react";
import { Users, ChevronDown, UserCheck, User, TrendingUp } from "lucide-react";
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
import RecentUsersTable from "../../components/RecentUserTable/RecentUserTable";
import BannerUploader from "../../components/Banneruploader";
import { useGetDashboardAnalyticsQuery } from "../../redux/api/dashboardApi";

const formatMonth = (month) =>
  month ? month.charAt(0) + month.slice(1).toLowerCase() : "";

const DashboardPage = () => {
  const currentYear = new Date().getFullYear();

  const [customerGrowthYear, setCustomerGrowthYear] = useState(currentYear);
  const [purchaseGrowthYear, setPurchaseGrowthYear] = useState(currentYear);

  const { data, isLoading, isFetching } = useGetDashboardAnalyticsQuery({
    purchaseGrowthYear,
    customerGrowthYear,
  });

  const dashboardData = data?.data;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor and analyse your Limitless Solution Application
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={dashboardData?.summary?.totalUsers || 0}
              icon={Users}
            />
            <StatCard
              title="Total Customers"
              value={dashboardData?.summary?.customer || 0}
              icon={UserCheck}
            />
            <StatCard
              title="Total Employees"
              value={dashboardData?.summary?.staff || 0}
              icon={User}
            />
            <StatCard
              title="Total Metals"
              value={dashboardData?.summary?.totalMetals || 0}
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <IndependentChartCard
          title="Monthly Customer Growth"
          type="book"
          chartType="area"
          data={dashboardData?.customerGrowth}
          year={customerGrowthYear}
          onYearChange={setCustomerGrowthYear}
          loading={isFetching}
        />
        <IndependentChartCard
          title="Monthly Purchase Overview"
          type="blog"
          chartType="bar"
          data={dashboardData?.purchaseGrowth}
          year={purchaseGrowthYear}
          onYearChange={setPurchaseGrowthYear}
          loading={isFetching}
        />
      </div>

      {/* Recent Users Table */}
      <div>
        <BannerUploader />
      </div>
    </div>
  );
};

const IndependentChartCard = ({
  title,
  type,
  chartType,
  data,
  year,
  onYearChange,
  loading,
}) => {
  const startYear = 2024;
  const endYear = 2050;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const chartData = (data || []).map((item) => ({
    name: formatMonth(item.month),
    count: item.count,
  }));

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
              onChange={(e) => onYearChange(Number(e.target.value))}
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
        {loading ? (
          <SkeletonChart />
        ) : (
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
                  fill="#652D8B"
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
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  const Icon = icon;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-5 items-start transition-all hover:shadow-md hover:-translate-y-1 group">
      <div className="p-3 bg-[#F0EAF3] rounded-xl border border-slate-100 group-hover:text-white transition-all duration-300">
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
};

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

const SkeletonChart = () => {
  const heights = [45, 70, 30, 80, 55, 65];
  return (
    <div className="w-full h-full flex flex-col justify-end gap-4 animate-pulse pt-4">
      <div className="flex items-end justify-between gap-2 h-full px-2">
        {heights.map((h, i) => (
          <div
            key={i}
            className="bg-slate-100 w-full rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="h-4 w-full bg-slate-50 rounded" />
    </div>
  );
};

export default DashboardPage;
