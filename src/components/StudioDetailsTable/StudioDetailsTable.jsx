import { Table } from "antd";
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
    title: "Studio Name",
    dataIndex: "studioName",
    key: "studioName",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Completed Projects",
    dataIndex: "CompletedProjects",
    key: "CompletedProjects",
  },

 
];

const StudioDetailsTable = ({ users }) => {
  return (
    <div>
        <Table
        columns={columns}
        dataSource={users}
        pagination={false}
        rowKey="key"
      />
    </div>
  )
}

export default StudioDetailsTable