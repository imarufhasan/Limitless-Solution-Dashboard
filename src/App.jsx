import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import Layout from "./pages/Layout"; 
import DashboardPage from "./pages/Dashboard";
import AccountSettings from "./pages/AccountSettings";
import EditProfile from "./pages/EditProfile";
import PrivacySettings from "./pages/PrivacySettings";
import TermsAndConditions from "./pages/TermsAndConditions";
import UserManagement from "./pages/UserManagement";
import MetalPrice from "./pages/MetalPrice/MetalPrice";
import EmployeeManagement from "./pages/EmployeeManagement";
import RequestOrder from "./pages/RequestOrder/RequestOrder";
import Order from "./pages/Order";
import Messages from "./pages/Messages";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ <Navigate to="/login" />} />

        {/* Routes without Sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
        <Route path="/verifyCode" element={<VerifyCodePage />} />
        <Route path="/setNewPassword" element={<SetNewPasswordPage />} />

        {/* Routes with Sidebar (using Layout) */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <DashboardPage />
            </Layout>
          }
        />
      
        <Route
          path="/user-management"
          element={
            <Layout>
              <UserManagement/>
            </Layout>
          }
        />
        <Route
          path="/add-metal-price"
          element={
            <Layout>
              <MetalPrice/>
            </Layout>
          }
        />
      
        <Route
          path="/requested-orders"
          element={
            <Layout>
              <RequestOrder/>
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
          path="/accountsettings"
          element={
            <Layout>
              <AccountSettings />
            </Layout>
          }
        />
        <Route
          path="/editprofile"
          element={
            <Layout>
              <EditProfile />
            </Layout>
          }
        />
        <Route
          path="/privacysettings"
          element={
            <Layout>
              <PrivacySettings />
            </Layout>
          }
        />
        <Route
          path="/termsandconditions"
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
