import { useState } from "react";
import { Table, Modal } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useUpdateUserStatusMutation } from "../../redux/api/profileApi";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=652D8B&color=fff&name=";

// ---- Skeleton shimmer ----
function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded ${className}`}
      style={{
        background:
          "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite linear",
      }}
    />
  );
}

if (
  typeof document !== "undefined" &&
  !document.getElementById("shimmer-style")
) {
  const style = document.createElement("style");
  style.id = "shimmer-style";
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

function TableSkeletonRows({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          <td className="px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-44" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-20" />
          </td>
          {/* Role badge skeleton */}
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-14 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-16 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-5 w-5 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}

function UserAvatar({ src, name }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallback = `${DEFAULT_AVATAR}${encodeURIComponent(name || "User")}`;
  const imgSrc = !src || error ? fallback : src;
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-4 h-4 border-2 border-[#652D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={name}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}

// ---- Status Modal ----
function StatusModal({ user, onClose }) {
  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();

  const isActive = user?.status === "active";
  const targetStatus = isActive ? "blocked" : "active";

  const handleConfirm = async () => {
    try {
      const reqData = { id: user._id, status: targetStatus };
      await updateUserStatus(reqData).unwrap();
      toast.success(
        `User ${targetStatus === "blocked" ? "blocked" : "activated"} successfully!`,
      );
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  return (
    <Modal open={!!user} onCancel={onClose} footer={null} centered width={400}>
      <div className="text-center py-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isActive ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {isActive ? (
            <StopOutlined style={{ fontSize: 28, color: "red" }} />
          ) : (
            <CheckCircleOutlined style={{ fontSize: 28, color: "green" }} />
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {isActive ? "Block User?" : "Activate User?"}
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          {isActive
            ? `Are you sure you want to block "${user?.name}"? They won't be able to access the platform.`
            : `Are you sure you want to activate "${user?.name}"? They will regain access to the platform.`}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-100 text-slate-700 font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } disabled:opacity-50`}
          >
            {isLoading
              ? "Updating..."
              : isActive
                ? "Yes, Block"
                : "Yes, Activate"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---- Role badge ----
function RoleBadge({ role }) {
  const styles =
    role === "admin"
      ? "bg-purple-100 text-[#652D8B]"
      : role === "staff"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-500";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles}`}
    >
      {role || "—"}
    </span>
  );
}

// ---- Main Table ----
const RecentUsersTable = ({ users, isLoading }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    {
      title: "#",
      key: "avatar",
      render: (_, record) => (
        <UserAvatar src={record.profileImage} name={record.name} />
      ),
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div>
          <p className="font-semibold">{record.name || "—"}</p>
          <p className="text-gray-500 text-sm">{record.email || "—"}</p>
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (val) => val || "—",
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (val) => val || "—",
    },
    {
      title: "Joined",
      dataIndex: "joinedAt",
      key: "joinedAt",
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <RoleBadge role={role} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : status === "blocked"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-500"
          }`}
        >
          {status || "—"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "active" ? (
          <StopOutlined
            onClick={() => setSelectedUser(record)}
            style={{ color: "red", fontSize: "18px", cursor: "pointer" }}
          />
        ) : (
          <CheckCircleOutlined
            onClick={() => setSelectedUser(record)}
            style={{ color: "green", fontSize: "18px", cursor: "pointer" }}
          />
        ),
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "#",
                "User",
                "Phone Number",
                "Location",
                "Joined",
                "Role",
                "Status",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            <TableSkeletonRows rows={8} />
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        loading={false}
        pagination={false}
        rowKey="_id"
      />
      <StatusModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
};

export default RecentUsersTable;
