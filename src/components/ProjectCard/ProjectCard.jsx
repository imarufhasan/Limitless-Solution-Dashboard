import { CalendarDays, Clock } from "lucide-react";

const ProjectCard = ({ artist, studio, date, time, price, status }) => {
  return (
     <div className="bg-[#0E0E0F] text-white p-4 rounded-lg w-[320px] border border-[#1f1f22]">

      <p className="text-xs text-gray-400">Artist</p>
      <p className="font-semibold">{artist}</p>

      <p className="text-xs text-gray-400 mt-2">Studio</p>
      <p className="font-semibold">{studio}</p>

      <div className="flex items-center gap-5 text-sm text-gray-300 mt-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          {date}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          {time}
        </div>
      </div>

      <div className="border-t border-[#222] my-3"></div>

      <div className="flex items-center justify-between">

        <p className="text-[#652D8B] font-semibold text-lg">${price}</p>

        {/* STATUS */}
        {status === "Completed" && (
          <span className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">
            Completed
          </span>
        )}

        {status === "Active" && (
          <span className="bg-green-900 text-green-300 text-xs px-3 py-1 rounded-full">
            Active
          </span>
        )}

        {status === "Pending" && (
          <span className="bg-yellow-900 text-yellow-300 text-xs px-3 py-1 rounded-full">
            Pending
          </span>
        )}
      </div>

      {/* Pending Buttons */}
      {status === "Pending" && (
        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-linear-to-r from-[#6C4CFF] to-[#652D8B] py-2 rounded-lg">
            Approve
          </button>

          <button className="flex-1 bg-red-900 text-red-300 py-2 rounded-lg">
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectCard