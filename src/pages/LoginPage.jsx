import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Text from "../components/Text";
import Inputbox from "../components/InputBox";
import Button from "../components/Button";
import { useLoginMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";


const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const userInfo = {
      email: email,
      password: password,
    };
    try {
      const res = await login(userInfo).unwrap();
      console.log(res)
      if (res?.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        navigate("/dashboard");
        toast.success(res.message || "Login Successful");
      }
      console.log();
    } catch (error) {
      console.log(error);
    }


    // try {
    //   // .unwrap() allows us to use standard try/catch with RTK Query
    //   const response = await login({ email, password }).unwrap();

    //   if (response?.success) {
    //     const token = response.data?.token;

    //     // Save token to cookie (7 days if 'remember' is checked)
    //     setCookie("NessasBrokenWorldAuthToken", token, {
    //       path: "/",
    //       maxAge: remember ? 7 * 24 * 60 * 60 : undefined,
    //     });

    //     // Store user data for UI personalization
    //     localStorage.setItem("user", JSON.stringify(response.data.userData));

    //     toast.success(response.message || "Login Successful");
    //     navigate("/dashboard");
    //   }
    // } catch (err) {
    //   // Handles 400/500 errors from the server
    //   const errorMsg =
    //     err?.data?.message || "Invalid credentials. Please try again.";
    //   toast.error(errorMsg);
    // }
    // navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      {/* Subtle border and soft shadow for a premium feel */}
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 w-150">
        <div className="text-center mb-8">
          <Text
            text="Login to your account"
            className="text-2xl font-bold text-gray-800"
          />
          <p className="text-sm text-gray-500 mt-2">
            Please enter your email and password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Inputbox
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Inputbox
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>

            <Link
              to="/forgetPassword"
              title="Reset your password"
              className="font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="pt-2">
            <Button
              buttonText={"Sign In"}
              // disabled={isLoading}
              // loading={isLoading} // Pass the API loading state here
              className="w-full py-3 transition-all active:scale-[0.98]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
