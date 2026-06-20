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
import RequestOrder from "./pages/Request/RequestOrder";
import Order from "./pages/Order/Order";
import Messages from "./pages/Messages";
import ReviewQuotePage from "./pages/Common/ReviewQuotePage";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
        <Route path="/verifyCode" element={<VerifyCodePage />} />
        <Route path="/setNewPassword" element={<SetNewPasswordPage />} />

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
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-metal-price"
          element={
            <ProtectedRoute>
              <Layout>
                <MetalPrice />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requested-orders"
          element={
            <ProtectedRoute>
              <Layout>
                <RequestOrder />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-management"
          element={
            <ProtectedRoute>
              <Layout>
                <EmployeeManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Layout>
                <Order />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-details/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ReviewQuotePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/aboutUs"
          element={
            <ProtectedRoute>
              <Layout>
                <AboutUs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editProfile"
          element={
            <ProtectedRoute>
              <Layout>
                <EditProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacySettings"
          element={
            <ProtectedRoute>
              <Layout>
                <PrivacySettings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/termsAndConditions"
          element={
            <ProtectedRoute>
              <Layout>
                <TermsAndConditions />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
