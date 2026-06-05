import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

export default function AddEmployeeModal({ open, onClose }) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Employee Data:", values);
        form.resetFields();
        onClose();
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

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
      styles={{
        header: { paddingBottom: 8 },
        body: { paddingTop: 8 },
      }}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label={<span className="font-medium text-gray-700">Full Name</span>}
          name="fullName"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input
            placeholder="e.g., Rajesh Kumar"
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
            placeholder="employee@scrapmate.com"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-medium text-gray-700">Phone Number</span>
          }
          name="phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input
            placeholder="+91 98765 43210"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-gray-700">Location</span>}
          name="location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input
            placeholder="Dhaka"
            size="large"
            className="rounded-lg"
          />
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
            placeholder="Bangalore"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              Confirmed Password
            </span>
          }
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Bangalore"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <div className="flex gap-3 mt-6">
          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={handleSubmit}
            className="flex-1 h-11 rounded-lg font-medium"
            style={{
              backgroundColor: "#6B3FA0",
              borderColor: "#6B3FA0",
            }}
          >
            Add Employee
          </Button>
          <Button
            size="large"
            onClick={handleCancel}
            className="flex-1 h-11 rounded-lg font-medium text-gray-600 border-gray-200 hover:border-gray-300"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
}


// --- Demo wrapper (remove in production) ---
export function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <Button
        type="primary"
        size="large"
        onClick={() => setOpen(true)}
        style={{ backgroundColor: "#6B3FA0", borderColor: "#6B3FA0" }}
      >
        Open Modal
      </Button>
      <AddEmployeeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}