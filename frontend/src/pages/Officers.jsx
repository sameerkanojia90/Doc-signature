import { useEffect, useState } from "react";
import { Table, Button, Modal, message, Popconfirm } from "antd";

function OfficerDocuments() {
  const [data, setData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        const formatted = result.data.map((doc) => ({
          _id: doc._id,
          title: doc.Doctitle || "No Title",
          status: doc.status || "Pending",
        }));

        setData(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // ✅ SIGN
  const handleSign = async () => {
    try {
      const formData = new FormData();
      formData.append("signedFile", selectedDoc.file);

      const res = await fetch(
        `http://localhost:5000/api/requests/${selectedDoc._id}/sign`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        message.success("Signed ✅");
        setOpen(false);
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/requests/${id}/reject`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.success) {
      message.warning("Rejected ❌");
      fetchDocs();
    }
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/requests/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.success) {
      message.success("Deleted 🗑");
      fetchDocs();
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          style={{
            color:
              text === "Signed"
                ? "green"
                : text === "Rejected"
                ? "red"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedDoc(record);
              setOpen(true);
            }}
          >
            View
          </Button>

          <Button danger onClick={() => handleReject(record._id)}>
            Reject
          </Button>

          <Popconfirm
            title="Delete document?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger type="dashed">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Officer Panel</h2>

      <Table columns={columns} dataSource={data} rowKey="_id" />

      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        {selectedDoc && (
          <div>
            <p><strong>Title:</strong> {selectedDoc.title}</p>
            <p><strong>Status:</strong> {selectedDoc.status}</p>

            <input
              type="file"
              onChange={(e) =>
                setSelectedDoc({
                  ...selectedDoc,
                  file: e.target.files[0],
                })
              }
            />

            <Button type="primary" onClick={handleSign}>
              Sign & Upload
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OfficerDocuments;