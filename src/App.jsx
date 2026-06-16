import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import Layout from "./pages/Layout";
import DashboardPage from "./pages/Dashboard/Dashboard";
import AboutUs from "./pages/Settings/AboutUs";
import EditProfile from "./pages/Settings/EditProfile";
import PrivacySettings from "./pages/Settings/PrivacySettings";
import TermsAndConditions from "./pages/Settings/TermsAndConditions";
import UserManagement from "./pages/UserManagement";
import MetalPrice from "./pages/Metal/MetalPrice";
import EmployeeManagement from "./pages/Employee/EmployeeManagement";
import RequestOrder from "./pages/Order/RequestOrder";
import Order from "./pages/Order/Order";
import Messages from "./pages/Messages";
import ReviewQuotePage from "./pages/Common/ReviewQuotePage";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Routes without Sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
        <Route path="/verifyCode" element={<VerifyCodePage />} />
        <Route path="/setNewPassword" element={<SetNewPasswordPage />} />

        {/* Routes with Sidebar (using Layout) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <Layout>
              <UserManagement />
            </Layout>
          }
        />
        <Route
          path="/add-metal-price"
          element={
            <Layout>
              <MetalPrice />
            </Layout>
          }
        />

        <Route
          path="/requested-orders"
          element={
            <Layout>
              <RequestOrder />
            </Layout>
          }
        />
        <Route
          path="/employee-management"
          element={
            <Layout>
              <EmployeeManagement />
            </Layout>
          }
        />
        <Route
          path="/order"
          element={
            <Layout>
              <Order />
            </Layout>
          }
        />
        <Route
          path="/messages"
          element={
            <Layout>
              <Messages />
            </Layout>
          }
        />
        <Route
          path="/order-details/:id"
          element={
            <Layout>
              <ReviewQuotePage />
            </Layout>
          }
        />

        <Route
          path="/aboutUs"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/editProfile"
          element={
            <Layout>
              <EditProfile />
            </Layout>
          }
        />
        <Route
          path="/privacySettings"
          element={
            <Layout>
              <PrivacySettings />
            </Layout>
          }
        />
        <Route
          path="/termsAndConditions"
          element={
            <Layout>
              <TermsAndConditions />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
