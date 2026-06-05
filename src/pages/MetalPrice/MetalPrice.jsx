import { Edit2, Search, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import AddEditMetalModal from "../../components/AddEditMetalModal";

const metalData = [
  {
    id: 1,
    name: "Iron",
    change: "+ 5.2%",
    trend: "up",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 2,
    name: "Steel",
    change: "+ 5.2%",
    trend: "up",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 3,
    name: "Copper",
    change: "+ 5.2%",
    trend: "up",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 4,
    name: "Aluminum",
    change: "- 2.1%",
    trend: "down",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 5,
    name: "Brass",
    change: "- 2.1%",
    trend: "down",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 6,
    name: "Lead",
    change: "+ 5.2%",
    trend: "up",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 7,
    name: "Radiator",
    change: "+ 5.2%",
    trend: "up",
    perKg: "$50",
    perPiece: "$05",
  },
  {
    id: 8,
    name: "Tires",
    change: "- 2.1%",
    trend: "down",
    perKg: "$50",
    perPiece: "$05",
  },
];

const MetalPrice = () => {
  const [searchTerm, setSearchTerm] = useState("");
   const [open, setOpen] = useState(false);

  const filteredData = metalData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-[#111827]">
            Metal Prices
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage scrap metal prices and rates
          </p>
        </div>

        <button onClick={() => setOpen(true)} className="bg-[#652D8B] hover:bg-[#5b21b6] text-white px-5 py-3 rounded-xl text-sm font-medium transition-all">
          + Add New Metal
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by metal name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F3F4F6] rounded-xl py-3 pl-11 pr-4 outline-none text-sm border border-transparent focus:border-[#D1D5DB]"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-4"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  {item.name}
                </h2>

                <div
                  className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                    item.trend === "up"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.trend === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}

                  {item.change}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setOpen(true)}>
                  <Edit2
                    size={16}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </button>

                <button>
                  <Trash2
                    size={16}
                    className="text-red-500 hover:text-red-700"
                  />
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#F3F4F6] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Per Kg</p>

                <h3 className="text-[22px] font-bold text-[#652D8B]">
                  {item.perKg}
                  <span className="text-sm font-medium text-gray-600">
                    {" "}
                    /kg
                  </span>
                </h3>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Per Piece</p>

                <h3 className="text-[22px] font-bold text-[#652D8B]">
                  {item.perPiece}
                  <span className="text-sm font-medium text-gray-600">
                    {" "}
                    /pc
                  </span>
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddEditMetalModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default MetalPrice;