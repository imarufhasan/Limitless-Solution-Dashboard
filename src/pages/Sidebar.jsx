import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { BookCheck, MessageSquare, MonitorCloud, LogOut } from "lucide-react";
import { useLogOutMutation } from "../redux/api/authApi";
import { useState } from "react";

const LogoutModal = ({ onConfirm, onCancel, isLoading }) => (
  <div
    className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-2xl shadow-xl w-90 p-8 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-5">
        <LogOut className="w-6 h-6 text-[#652D8B]" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Sign out of dashboard?
      </h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        You'll need to log back in to access the admin panel.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-[#652D8B] text-white text-sm font-medium hover:bg-[#7a35a8] transition-colors disabled:opacity-50"
        >
          {isLoading ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  </div>
);

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
  const [logOut, { isLoading }] = useLogOutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname === "/dashboard") {
      window.location.reload();
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      const fcmToken = localStorage.getItem("fcmToken");
      await logOut({ fcmToken: fcmToken ?? "fcmToken" }).unwrap();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("fcmToken");
      window.location.href = "/login";
    }
  };

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
          isLoading={isLoading}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen flex flex-col p-5 transition-all duration-300 bg-[#F0EAF3] text-[#0F0B18] z-50 ${
          sidebarVisible ? "w-64" : "w-24"
        }`}
      >
        <div className="flex items-center justify-between mb-8 w-full relative">
          {sidebarVisible && (
            <div
              onClick={handleLogoClick}
              className="w-full flex justify-center cursor-pointer"
            >
              <img src={logo} alt="Logo" className="h-14 w-auto" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar">
          <ul className="space-y-2">
            <SidebarItem to="/dashboard" icon={LuLayoutDashboard} label="Overview" />
            <SidebarItem to="/user-management" icon={LiaUserFriendsSolid} label="User Management" />
            <SidebarItem to="/add-metal-price" icon={MonitorCloud} label="Add Metal Price" />
            <SidebarItem to="/requested-orders" icon={FiShoppingBag} label="Requestes" />
            <SidebarItem to="/employee-management" icon={LiaUserFriendsSolid} label="Employee" />
            <SidebarItem to="/order" icon={BookCheck} label="Orders" />
            <SidebarItem to="/messages" icon={MessageSquare} label="Messages" />

            <li className="relative group/parent">
              <button className="w-full px-4 py-3 rounded-2xl flex items-center group transition-all text-[#0F0B18] hover:bg-neutral-800 hover:text-white">
                <IoSettingsOutline className="mr-3 size-5 group-hover:text-white" />
                <span className="font-medium">Settings</span>
                <FaChevronRight className="ml-auto w-3 h-3 transition-transform duration-300 group-hover/parent:rotate-90" />
              </button>
              <ul className="pl-4 mt-2 space-y-2 hidden group-hover/parent:block border-l border-neutral-800 ml-4">
                <SidebarItem to="/editProfile" icon={CgProfile} label="Edit Profile" />
                <SidebarItem to="/aboutUs" icon={CiCircleInfo} label="About Us" />
                <SidebarItem to="/privacySettings" icon={MdOutlinePrivacyTip} label="Privacy Settings" />
                <SidebarItem to="/termsAndConditions" icon={FaRegNewspaper} label="Terms & Conditions" />
              </ul>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-neutral-800">
          {sidebarVisible ? (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full px-4 py-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center transition-all"
            >
              <FaSignOutAlt className="mr-3 size-5" />
              <span className="font-medium">Log Out</span>
            </button>
          ) : (
            <div className="flex justify-center pb-4">
              <FaSignOutAlt
                onClick={() => setShowLogoutModal(true)}
                className="size-6 text-neutral-500 hover:text-red-400 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;