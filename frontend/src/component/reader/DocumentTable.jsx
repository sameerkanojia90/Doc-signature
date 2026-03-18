

import { Table, Dropdown, Menu, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function DocumentTable({ data, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this request?",
      content: `Title: ${record.title}`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => onDelete(record.id),
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() =>
            navigate("/document-preview", { state: { document: record } })
          }
        >
          {text}
        </span>
      ),
    },
    { title: "Number of Documents", dataIndex: "numDocs", key: "numDocs" },
    { title: "Rejected Documents", dataIndex: "rejectedDocs", key: "rejectedDocs" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Last Activity Date", dataIndex: "lastActivity", key: "lastActivity" },
    { title: "Request Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="1"
              onClick={() =>
                navigate("/document-preview", { state: { document: record } })
              }
            >
              View
            </Menu.Item>
            <Menu.Item key="2">Edit</Menu.Item>
            <Menu.Item
              key="3"
              onClick={() => handleDelete(record)}
              className="delete-item"
            >
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["hover"]}>
            <MoreOutlined className="action-icon" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      pagination={{ pageSize: 5 }} 
    />
  );
}

export default DocumentTable;
