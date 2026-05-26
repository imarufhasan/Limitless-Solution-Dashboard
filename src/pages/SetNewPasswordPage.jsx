import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Text from "../components/Text";
import Inputbox from "../components/InputBox";
import Button from "../components/Button";
import { CgPassword } from "react-icons/cg";

const SetNewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data passed from VerifyCodePage
  const email = location.state?.email || "";
  const verificationCode = location.state?.verificationCode || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/login");

    // if (!newPassword || !confirmPassword) {
    //   toast.error("Please fill in all fields.");
    //   return;
    // }

    // if (newPassword !== confirmPassword) {
    //   toast.error("Passwords do not match. Please try again.");
    //   return;
    // }

    // if (newPassword.length < 6) {
    //   toast.error("Password must be at least 6 characters long.");
    //   return;
    // }

    // try {
    //   // Send the data required by your backend
    //   await changePassword({
    //     email: email,
    //     password: newPassword,
    //   }).unwrap();

    //   toast.success("Password updated successfully!");

    //   // Navigate to login after successful reset
    //   setTimeout(() => {
    //     navigate("/login");
    //   }, 2000);
    // } catch (err) {

    //   toast.error(err?.data?.message || "Failed to update password.");
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-150">
        <Text text="Set a new password" />

        <p className="text-center text-gray-600 mb-4">
          Create a new password for{" "}
          <span className="font-medium text-black">{email}</span>.
        </p>

        <form onSubmit={handleSubmit}>
          <Inputbox
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <Inputbox
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />

          <Button
            buttonText="Update Password"
            handleSubmit={handleSubmit}
            // loading={isLoading} // Show spinner during API call
          />
        </form>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
