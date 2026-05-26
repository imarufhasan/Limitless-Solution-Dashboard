import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Text from "../components/Text";
import Button from "../components/Button";

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state (passed from ForgotPasswordPage)
  const email = location.state?.email || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);



  const handleInputChange = (value, index) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value !== "" && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newCode = [...code];
    data.split("").forEach((char, index) => {
      newCode[index] = char;
    });
    setCode(newCode);

    const nextIndex = data.length < 6 ? data.length : 5;
    inputRefs.current[nextIndex].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const enteredCode = code.join("");
    navigate("/setNewPassword");
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-150">
        <Text text="Verification code" />
        <p className="text-center text-gray-600 mb-4">
          We sent a reset link to{" "}
          <span className="font-semibold">{email || "your email"}</span> <br />
          Enter the 6-digit code mentioned in the email
        </p>

        <form
          // onSubmit={handleSubmit}
          className="flex justify-center mb-6 space-x-2"
        >
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              maxLength="1"
              className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </form>

        <Button
          handleSubmit={handleSubmit}
          buttonText="Verify Code"
        />

        <p className="text-center mt-6 text-gray-600">
          You have not received the email?{" "}
          <button
          // className={`text-sm font-medium ${
          //   isResending ? "text-gray-400" : "text-green-500 hover:underline"
          // } bg-transparent border-none cursor-pointer`}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyCodePage;
