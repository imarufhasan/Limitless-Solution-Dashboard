import { useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useCreateEmployeeMutation } from "../redux/api/employeeApi";
import { message } from "antd";

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "empSpin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

// ── Animated dots ─────────────────────────────────────────────────────────────
function Dots() {
  return (
    <span style={{ letterSpacing: 1 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            animation: `empPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        >
          .
        </span>
      ))}
    </span>
  );
}

// ── Keyframes injected once ───────────────────────────────────────────────────
if (
  typeof document !== "undefined" &&
  !document.getElementById("emp-btn-style")
) {
  const s = document.createElement("style");
  s.id = "emp-btn-style";
  s.textContent = `
    @keyframes empSpin   { to { transform: rotate(360deg); } }
    @keyframes empPulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes empFill   { from{width:0%} to{width:88%} }
    @keyframes empSlideUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

    .emp-add-btn {
      position: relative; overflow: hidden;
      display: inline-flex; align-items: center; justify-content: center;
      gap: 8px; flex: 1; height: 44px;
      background: #652D8B; color: #fff;
      border: none; border-radius: 10px;
      font-size: 14px; font-weight: 500;
      cursor: pointer; transition: background 0.2s, transform 0.1s;
      user-select: none; outline: none;
    }
    .emp-add-btn:not(:disabled):hover  { background: #7b36a8; }
    .emp-add-btn:not(:disabled):active { transform: scale(0.98); }
    .emp-add-btn:disabled              { cursor: not-allowed; }

    .emp-add-btn.loading { background: #7b36a8; }
    .emp-add-btn.success { background: #16A34A; transition: background 0.3s; cursor: default; }

    .emp-progress {
      position: absolute; bottom: 0; left: 0; height: 3px;
      background: rgba(255,255,255,0.45); border-radius: 0;
      animation: empFill 2.8s ease-out forwards;
    }

    .emp-btn-label { animation: empSlideUp 0.18s ease-out both; }

    .emp-cancel-btn {
      flex: 1; height: 44px; background: transparent;
      border: 1px solid #E5E7EB; border-radius: 10px;
      font-size: 14px; font-weight: 500; color: #374151;
      cursor: pointer; transition: background 0.15s, border-color 0.15s;
    }
    .emp-cancel-btn:not(:disabled):hover { background: #F9FAFB; border-color: #D1D5DB; }
    .emp-cancel-btn:disabled             { opacity: 0.45; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
}

// ── AddEmployeeModal ──────────────────────────────────────────────────────────
export default function AddEmployeeModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const [succeeded, setSucceeded] = useState(false);

  const btnClass = `emp-add-btn${isLoading ? " loading" : ""}${succeeded ? " success" : ""}`;

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await createEmployee({
            name: values.name,
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber,
            role: values.role,
            address: values.address,
          }).unwrap();

          // Brief success flash before closing
          setSucceeded(true);
          setTimeout(() => {
            setSucceeded(false);
            form.resetFields();
            onClose();
          }, 1000);
        } catch (err) {
          message.error(
            err?.data?.message || err?.message || "Failed to add employee",
          );
        }
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    setSucceeded(false);
    onClose();
  };

  // ── Button content by state ──
  let btnContent;
  if (succeeded) {
    btnContent = (
      <span
        className="emp-btn-label"
        style={{ display: "flex", alignItems: "center", gap: 7 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Employee Added
      </span>
    );
  } else if (isLoading) {
    btnContent = (
      <>
        <Spinner />
        <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
          Adding
          <Dots />
        </span>
        <span className="emp-progress" />
      </>
    );
  } else {
    btnContent = (
      <span
        className="emp-btn-label"
        style={{ display: "flex", alignItems: "center", gap: 7 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        Add Employee
      </span>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={480}
      centered
      title={
        <span className="text-lg font-semibold text-gray-900">
          Add New Employee
        </span>
      }
      styles={{ header: { paddingBottom: 8 }, body: { paddingTop: 8 } }}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label={<span className="font-medium text-gray-700">Full Name</span>}
          name="name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input
            placeholder="e.g., Fahim Hossain"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-medium text-gray-700">Email Address</span>
          }
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            placeholder="employee@example.com"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-medium text-gray-700">Phone Number</span>
          }
          name="phoneNumber"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input
            placeholder="+8801951976238"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700">Address</span>}
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Dhaka" size="large" className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700">Role</span>}
          name="role"
          initialValue="staff"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select size="large">
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700">Password</span>}
          name="password"
          rules={[
            { required: true, message: "Please enter password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            placeholder="Min. 6 characters"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-medium text-gray-700">Confirm Password</span>
          }
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Re-enter password"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            type="button"
            className={btnClass}
            onClick={handleSubmit}
            disabled={isLoading || succeeded}
          >
            {btnContent}
          </button>
          <button
            type="button"
            className="emp-cancel-btn"
            onClick={handleCancel}
            disabled={isLoading || succeeded}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Modal>
  );
}
