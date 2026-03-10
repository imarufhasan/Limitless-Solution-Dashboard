import { Search } from "lucide-react";
import React, { useState } from "react";
import OrderCard from "../../components/OrderCard/OrderCard";
import user from "../../assets/images/user.png"
import user2 from "../../assets/images/user1.png"
import product from "../../assets/images/product2.png"
import ProjectCard from "../../components/ProjectCard/ProjectCard";

const Order = () => {

    const orders = [
        {
            id: 1,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Completed",
        },
        {
            id: 2,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Active",
        },
        {
            id: 3,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Pending",
        },
        {
            id: 4,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Pending",
        },
        {
            id: 5,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Pending",
        },
        {
            id: 6,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Pending",
        },
        {
            id: 7,
            artist: "Mike Johnson",
            studio: "Loud House Premium Studio",
            date: "March 10, 2026",
            time: "3:00 PM - 6:00 PM",
            price: 300,
            status: "Pending",
        },
    ];


    const [searchTerm, setSearchTerm] = useState("");
    const [projectStatus, setProjectStatus] = useState("Pending");



    console.log(projectStatus)

    return (
        <div className="min-h-screen bg-white p-6 md:p-5 font-sans text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        All Project
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage All Project
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
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
                    />
                </div>
                <div className="flex gap-5">
                    <button onClick={() => setProjectStatus("Pending")} className={` cursor-pointerwhitespace-nowrap px-4 py-2 rounded-lg ${projectStatus === "Pending" ? "bg-[#5B2EFF] text-white" : "bg-[#E8ECEF] text-slate-700"}`}>
                        Pending
                    </button>
                    <button onClick={() => setProjectStatus("Active")} className={` cursor-pointer whitespace-nowrap px-4 py-2 rounded-lg ${projectStatus === "Active" ? "bg-[#5B2EFF] text-white" : "bg-[#E8ECEF] text-slate-700"}`}>
                        Active
                    </button>
                    <button onClick={() => setProjectStatus("Completed")} className={` cursor-pointer whitespace-nowrap px-4 py-2 rounded-lg ${projectStatus === "Complete" ? "bg-[#5B2EFF] text-white" : "bg-[#E8ECEF] text-slate-700"}`}>
                        Complete
                    </button>

                </div>

            </div>


            {/* Project details section */}

            <div className="flex flex-wrap gap-10 justify-between">

                {orders
                    .filter((order) => order.status === projectStatus)
                    .map((order) => (
                        <ProjectCard
                            key={order.id}
                            artist={order.artist}
                            studio={order.studio}
                            date={order.date}
                            time={order.time}
                            price={order.price}
                            status={order.status}
                        />
                    ))}

            </div>




        </div>

    );
};

export default Order;
