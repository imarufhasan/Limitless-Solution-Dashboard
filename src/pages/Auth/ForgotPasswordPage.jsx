import React, { useState } from "react";
import Text from "../../components/Text";
import Inputbox from "../../components/InputBox";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/verifyCode")

  }
 

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-150">
        <Text text={"Forgot Password ?"} />

        <form >
          <Inputbox
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            handleSubmit={handleSubmit}
            buttonText={"Send Code"}
            // loading={isLoading} // Pass the API loading state here
            // disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
