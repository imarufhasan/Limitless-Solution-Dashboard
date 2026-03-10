import { Search } from 'lucide-react'
import React, { useState } from 'react'
import StudioDetailsTable from '../../components/StudioDetailsTable/StudioDetailsTable';


const StudioDetails = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const users = [
  {
    key: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    studioName : "Loud House Premium Studio",
    location: "123 Main St, New York",
    CompletedProjects: 5,
  },
  {
    key: "2",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    studioName : "Loud House Premium Studio",
    location: "123 Main St, New York",
    CompletedProjects: 3,
  },
  {
    key: "3",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    studioName : "Loud House Premium Studio",
    location: "123 Main St, New York",
    CompletedProjects: 7,
  },
  {
    key: "4",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    studioName : "Loud House Premium Studio",
    location: "123 Main St, New York",
    CompletedProjects: 2,
  },
  {
    key: "5",
    name: "John Smith",
    email: "john@example.com",
    phone: "+880 1840560614",
    studioName : "Loud House Premium Studio",
    location: "123 Main St, New York",
    CompletedProjects: 5,
  },
];

    return (
        <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Studio Details
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage Studio details
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
                        placeholder="Search By Studio Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
                    />
                </div>
              

            </div>

            {/* All Studio details section */}

          
            <StudioDetailsTable users={users} />
            
        </div>
    )
}

export default StudioDetails