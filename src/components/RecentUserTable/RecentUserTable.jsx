import { Table } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import img from "../../assets/images/user1.png";


const columns = [
  {
    title: "#",
    key: "avatar",
    render: () => (
      <img
        src={img}
        alt="user"
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
  },
  {
    title: "User",
    key: "user",
    render: (_, record) => (
      <div>
        <p className="font-semibold">{record.name}</p>
        <p className="text-gray-500 text-sm">{record.email}</p>
      </div>
    ),
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Joined",
    dataIndex: "joined",
    key: "joined",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span
        className={`px-4 py-1 rounded-full  text-sm font-medium ${
          status === "Active"
            ? "bg-green-100 text-green-700 px-8"
            : "bg-red-100 text-red-600"
        }`}
      >
        {status}
      </span>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) =>
      record.status === "Active" ? (
        <StopOutlined style={{ color: "red", fontSize: "18px", cursor: "pointer" }}  />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "18px", cursor: "pointer" }} />
      ),
  },
];

const RecentUsersTable = ({users}) => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default RecentUsersTable;