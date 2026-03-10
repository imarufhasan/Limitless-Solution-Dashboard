import React, { useState } from "react";
import { Camera, Eye, EyeOff, User, Mail } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import { FileUploader } from "../components/FileUploader";
import { ProfileSkeleton } from "../components/shimmer/ProfileSkeleton";

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("edit-profile");

  // ---- STATIC PROFILE DATA ----
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    avatar: "https://via.placeholder.com/150",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ---- HANDLERS ----

  // Profile Image (local preview only)
  const handleAvatarSelect = (file) => {
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large. Max 2MB allowed.");
    }

    setIsUploadingImage(true);

    setTimeout(() => {
      const previewUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, avatar: previewUrl }));
      setIsUploadingImage(false);
      toast.success("Profile picture updated!");
    }, 1000);
  };

  // Update Name (mock)
  const handleUpdateName = (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    setTimeout(() => {
      setIsUpdatingProfile(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  // Change Password (mock)
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }

    setIsChangingPassword(true);

    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password changed successfully!");
    }, 1200);
  };

  // Simulate loading (optional)
  const isLoading = false;
  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:pt-20 font-sans text-slate-800">
      <ToastContainer theme="colored" />

      {/* Profile Header */}
      <div className="w-full max-w-200 bg-[#5B2EFF] rounded-[2.5rem] p-8 mb-10 relative flex flex-col items-center shadow-xl">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 ${
              isUploadingImage ? "opacity-50" : ""
            }`}
          >
            <img
              src={profileData.avatar}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>

          <FileUploader onFileSelect={handleAvatarSelect} accept="image/*">
            <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer">
              {isUploadingImage ? (
                <div className="w-4 h-4 border-2 border-[#5B2EFF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </div>
          </FileUploader>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-white">
            {profileData.name}
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-wider">
            {profileData.role}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mb-8 border-b w-full max-w-125 justify-center">
        {["edit-profile", "change-password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-bold capitalize ${
              activeTab === tab
                ? "text-[#5B2EFF] border-b-2 border-[#5B2EFF]"
                : "text-gray-400"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="w-full max-w-125">
        {activeTab === "edit-profile" ? (
          <form onSubmit={handleUpdateName} className="space-y-6">
            <FormInput
              label="Full Name"
              icon={<User size={18} />}
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />
            <FormInput
              label="Email Address"
              icon={<Mail size={18} />}
              value={profileData.email}
              readOnly
            />
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-4 bg-[#5B2EFF] text-white rounded-2xl font-bold"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <PasswordInput
              label="Current Password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
            <PasswordInput
              label="New Password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
            <PasswordInput
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-4 bg-[#5B2EFF] text-white rounded-2xl font-bold"
            >
              {isChangingPassword ? "Saving..." : "Save & Change"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ---- SUB COMPONENTS ----

function FormInput({ label, value, onChange, icon, readOnly }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full p-4 pl-12 rounded-xl border ${
            readOnly ? "bg-gray-100" : "bg-white"
          }`}
        />
        <div className="absolute left-4 inset-y-0 flex items-center text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full p-4 rounded-xl border"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 inset-y-0"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
