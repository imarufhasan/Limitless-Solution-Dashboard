import { NavLink } from "react-router-dom";
import { FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import logo from "../assets/images/logo.png";
import { BookCheck, MessageSquare, MonitorCloud } from "lucide-react";

const SidebarItem = ({ to, icon, label }) => {
  const Icon = icon;

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-full px-4 py-3 rounded-2xl flex items-center group transition-all duration-200 ${
            isActive
              ? "bg-[#652D8B] text-white"
              : "text-[#0F0B18] hover:bg-neutral-800 hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`mr-3 size-5 ${
                isActive ? "text-white" : "group-hover:text-white"
              }`}
            />
            <span className="font-medium">{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ sidebarVisible }) => {
  // const SidebarItem = ({ to, icon: Icon, label }) => (
  //   <li>
  //     <NavLink
  //       to={to}
  //       className={({ isActive }) =>
  //         `w-full px-4 py-3 rounded-2xl flex items-center group transition-all duration-200 ${
  //           isActive
  //             ? "bg-[#652D8B] text-white"
  //             : "text-[#0F0B18] hover:bg-neutral-800 hover:text-white"  // ✅ hover:text-white added
  //         }`
  //       }
  //     >
  //       {({ isActive }) => (
  //         <>
  //           <Icon
  //             className={`mr-3 size-5 ${
  //               isActive ? "text-white" : "group-hover:text-white"
  //             }`}
  //           />
  //           {sidebarVisible && <span className="font-medium">{label}</span>}
  //         </>
  //       )}
  //     </NavLink>
  //   </li>
  // );

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col p-5 transition-all duration-300 bg-[#F0EAF3] text-[#0F0B18] z-50 ${
        sidebarVisible ? "w-64" : "w-24"
      }`}
    >
      <div className="flex items-center justify-between mb-8 w-full relative">
        {sidebarVisible && (
          <div className="w-full flex justify-center">
            <img src={logo} alt="Logo" className="h-14 w-auto" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-2">
          <SidebarItem
            to="/dashboard"
            icon={LuLayoutDashboard}
            label="Overview"
          />
          <SidebarItem
            to="/user-management"
            icon={LiaUserFriendsSolid}
            label="User Management"
          />
          <SidebarItem
            to="/add-metal-price"
            icon={MonitorCloud}
            label="Add Metal Price"
          />
          <SidebarItem
            to="/requested-orders"
            icon={FiShoppingBag}
            label="Requestes"
          />
          <SidebarItem
            to="/employee-management"
            icon={LiaUserFriendsSolid}
            label="Employee "
          />
          <SidebarItem to="/order" icon={BookCheck} label="Orders" />
          <SidebarItem to="/messages" icon={MessageSquare} label="Messages" />

          <li className="relative group/parent">
            <button className="w-full px-4 py-3 rounded-2xl flex items-center group transition-all text-[#0F0B18] hover:bg-neutral-800 hover:text-white">
              <IoSettingsOutline className="mr-3 size-5 group-hover:text-white" />
              <span className="font-medium">Settings</span>
              <FaChevronRight className="ml-auto w-3 h-3 transition-transform duration-300 group-hover/parent:rotate-90" />
            </button>
            <ul className="pl-4 mt-2 space-y-2 hidden group-hover/parent:block border-l border-neutral-800 ml-4">
              <SidebarItem
                to="/editProfile"
                icon={CgProfile}
                label="Edit Profile"
              />
              <SidebarItem
                to="/aboutUs"
                icon={CiCircleInfo}
                label="About Us"
              />
              <SidebarItem
                to="/privacySettings"
                icon={MdOutlinePrivacyTip}
                label="Privacy Settings"
              />
              <SidebarItem
                to="/termsAndConditions"
                icon={FaRegNewspaper}
                label="Terms & Conditions"
              />
            </ul>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-neutral-800">
        {sidebarVisible ? (
          <button className="w-full px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center transition-all disabled:opacity-50">
            <FaSignOutAlt className="mr-3 size-5" />
            <span className="font-medium">Log Out</span>
          </button>
        ) : (
          <div className="flex justify-center pb-4">
            <FaSignOutAlt className="size-6 text-neutral-500 hover:text-red-400 cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
