import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineBookOpen } from "react-icons/hi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BiCategory } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import logo from "../assets/images/logo.png"
import { Monitor, MonitorCloud } from "lucide-react";

const Sidebar = ({ sidebarVisible, setSidebarVisible }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);


  const SidebarItem = ({ to, icon: Icon, label }) => (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-full px-4 py-3 rounded-2xl flex items-center group transition-all duration-200 ${isActive ? "bg-[#5B2EFF] text-white" : "text-white hover:bg-neutral-800"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`mr-3 size-5 ${isActive ? "text-white" : "group-hover:text-white"
                }`}
            />
            {sidebarVisible && <span className="font-medium">{label}</span>}
          </>
        )}
      </NavLink>
    </li>
  );

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col p-5 transition-all duration-300 bg-[#102837] text-white z-50 ${sidebarVisible ? "w-64" : "w-24"
        }`}
    >
      <div className="flex items-center justify-between mb-8 w-full relative">
        {sidebarVisible && (
          <div className=" w-full flex justify-center">
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
            to="/studio-details"
            icon={MonitorCloud}
            label="Studio Details"
          />
          <SidebarItem
            to="/pending-projects"
            icon={FiShoppingBag}
            label="Pending Projects"
          />
          

          <li className="relative group/parent">
            <button className="w-full px-4 py-3 rounded-2xl flex items-center group transition-all text-white hover:bg-neutral-800">
              <IoSettingsOutline className="mr-3 size-5" />
              <span className="font-medium">Settings</span>
              <FaChevronRight className="ml-auto w-3 h-3 transition-transform duration-300 group-hover/parent:rotate-90" />
            </button>
            <ul className="pl-4 mt-2 space-y-2 hidden group-hover/parent:block border-l border-neutral-800 ml-4">
              <SidebarItem
                to="/editprofile"
                icon={CgProfile}
                label="Edit Profile"
              />
              <SidebarItem
                to="/accountsettings"
                icon={CiCircleInfo}
                label="About Us"
              />
              <SidebarItem
                to="/privacysettings"
                icon={MdOutlinePrivacyTip}
                label="Privacy Settings"
              />
              <SidebarItem
                to="/termsandconditions"
                icon={FaRegNewspaper}
                label="Terms & Conditions"
              />
            </ul>
          </li>
        </ul>

      </nav>

      <div className="mt-auto pt-4 border-t border-neutral-800">
        {sidebarVisible ? (
          <button

            className="w-full px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center transition-all disabled:opacity-50"
          >
            <FaSignOutAlt className="mr-3 size-5" />
            <span className="font-medium">
              Log Out
            </span>
          </button>
        ) : (
          <div className="flex justify-center pb-4">
            <FaSignOutAlt
              className="size-6 text-neutral-500 hover:text-red-400 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
