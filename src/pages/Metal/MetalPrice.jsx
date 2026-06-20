import { Edit2, Search, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import AddEditMetalModal from "../../components/AddEditMetalModal";
import { useGetAllMetalsQuery } from "../../redux/api/metalApi";

// ---- Skeleton Card ----
const MetalCardSkeleton = () => (
  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 animate-pulse">
    <div className="flex items-start justify-between mb-5">
      <div className="space-y-2">
        <div className="h-5 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-3">
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="bg-[#F3F4F6] rounded-2xl p-4 flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-3 w-12 bg-gray-200 rounded" />
        <div className="h-7 w-20 bg-gray-300 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-12 bg-gray-200 rounded" />
        <div className="h-7 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  </div>
);

// ---- Metal Card ----
const MetalCard = ({ item, onEdit }) => {
  const isUp = item.priceTrendingDirection === "up";
  const trendText = item.priceTrending
    ? `${isUp ? "+" : ""} ${item.priceTrending?.toFixed(2)}%`
    : "No change";

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-[#111827] capitalize">
            {item.name}
          </h2>
          <div
            className={`flex items-center gap-1 mt-1 text-xs font-medium ${isUp ? "text-green-600" : "text-red-500"}`}
          >
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendText}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(item)}>
            <Edit2 size={16} className="text-blue-500 hover:text-blue-700" />
          </button>
          {/* <button onClick={() => onDelete(item._id)}>
            <Trash2 size={16} className="text-red-500 hover:text-red-700" />
          </button> */}
        </div>
      </div>

      <div className="bg-[#F3F4F6] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Price</p>
          <h3 className="text-[22px] font-bold text-[#652D8B]">
            ${item.price}
            <span className="text-sm font-medium text-gray-600">
              {" "}
              /{item.unit}
            </span>
          </h3>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Previous Price</p>
          <h3 className="text-[22px] font-bold text-gray-400">
            ${item.previousPrice}
            <span className="text-sm font-medium text-gray-400">
              {" "}
              /{item.unit}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

// ---- Main Page ----
const MetalPrice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [editingMetal, setEditingMetal] = useState(null);

  const { data, isLoading } = useGetAllMetalsQuery({
    page: 1,
    limit: 20,
    searchTerm,
  });
  //const [deleteMetal] = useDeleteMetalMutation();

  const metals = data?.data || [];

  const handleSearch = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(window._metalSearchTimer);
    window._metalSearchTimer = setTimeout(() => setSearchTerm(val), 500);
  };

  const handleEdit = (metal) => {
    setEditingMetal(metal);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMetal(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Metal Prices
          </h1>
          <p className="text-gray-500 mt-1">
            Manage scrap metal prices and rates
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#652D8B] hover:bg-[#5b21b6] text-white px-5 py-3 rounded-xl text-sm font-medium transition-all"
        >
          + Add New Metal
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by metal name"
            value={inputValue}
            onChange={handleSearch}
            className="w-full bg-[#F3F4F6] rounded-xl py-3 pl-11 pr-4 outline-none text-sm border border-transparent focus:border-[#D1D5DB]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <MetalCardSkeleton key={i} />)
        ) : metals.length === 0 ? (
          <div className="col-span-2 text-center py-20 text-gray-400">
            No metals found.
          </div>
        ) : (
          metals.map((item) => (
            <MetalCard
              key={item._id}
              item={item}
              onEdit={handleEdit}
              //onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <AddEditMetalModal
        open={open}
        onClose={handleClose}
        editingMetal={editingMetal}
      />
    </div>
  );
};

export default MetalPrice;
