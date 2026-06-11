import React, { useState } from "react";
import { Camera, Eye, EyeOff, User, Mail, Phone, MapPin } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FileUploader } from "../components/FileUploader";
import { ProfileSkeleton } from "../components/shimmer/ProfileSkeleton";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../redux/api/profileApi";

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("edit-profile");

  const { data, isLoading, isError, error } = useGetProfileQuery();
  const profile = data?.data;

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleAvatarSelect = (file) => {
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large. Max 2MB allowed.");
    }
    setIsUploadingImage(true);
    setImageLoaded(false);
    setTimeout(() => {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
      setIsUploadingImage(false);
    }, 500);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        address,
        phoneNumber,
        profileImage: avatarFile, // null if not changed
      }).unwrap();
      toast.success("Profile updated successfully!");
      setAvatarFile(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password.");
    }
  };

  console.log("isError:", isError);
  console.log("error:", error);
  console.log("token:", localStorage.getItem("token"));

  // Guards
  if (isLoading) return <ProfileSkeleton />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load profile. Please try again.
      </div>
    );
  if (!data?.data)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No profile data found.
      </div>
    );

  // Safe init after guards
  if (!initialized) {
    setName(profile.name || "");
    setAddress(profile.address || "");
    setPhoneNumber(profile.phoneNumber || "");
    setAvatar(profile.profileImage || "");
    setInitialized(true);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:pt-20 font-sans text-slate-800">
      <ToastContainer theme="colored" />

      {/* Profile Header */}
      <div className="w-full max-w-200 bg-[#652D8B] rounded-[2.5rem] p-8 mb-10 relative flex flex-col items-center shadow-xl">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 ${isUploadingImage ? "opacity-50" : ""}`}
          >
            {/* Spinner shown until image loads */}
            {!imageLoaded && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#652D8B] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={avatar}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0 absolute"}`}
              alt="Profile"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // stop spinner even if image fails
            />
          </div>
          <FileUploader onFileSelect={handleAvatarSelect} accept="image/*">
            <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer">
              {isUploadingImage ? (
                <div className="w-4 h-4 border-2 border-[#652D8B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </div>
          </FileUploader>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-gray-400 text-sm uppercase tracking-wider">
            {profile.role}
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
                ? "text-[#652D8B] border-b-2 border-[#652D8B]"
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
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <FormInput
              label="Full Name"
              icon={<User size={18} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              label="Email Address"
              icon={<Mail size={18} />}
              value={profile.email || ""}
              readOnly
            />
            <FormInput
              label="Phone Number"
              icon={<Phone size={18} />}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <FormInput
              label="Address"
              icon={<MapPin size={18} />}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-4 bg-[#652D8B] text-white rounded-2xl font-bold"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <PasswordInput
              label="Current Password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />
            <PasswordInput
              label="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            <PasswordInput
              label="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-4 bg-[#652D8B] text-white rounded-2xl font-bold"
            >
              {isChangingPassword ? "Saving..." : "Save & Change"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, icon, readOnly }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full p-4 pl-12 rounded-xl border ${readOnly ? "bg-gray-100" : "bg-white"}`}
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
