import { useEffect, useState } from "react";
import { Table, Button, Modal, message, Popconfirm } from "antd";

function OfficerDocuments() {
  const [data, setData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/requests/officer-requests",
        { credentials: "include" }
      );

      const result = await res.json();

      if (result.success) {
        const formatted = result.data
          .filter((doc) => doc.status !== "Rejected")
          .map((doc) => ({
            _id: doc._id,
            title: doc.Doctitle || "No Title",
            status: doc.status || "Pending",
            signedFile: doc.signature,
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

  const handleSign = async () => {
    if (!selectedDoc?.file) {
      return message.error("Select file");
    }

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

    const dataRes = await res.json();

    if (dataRes.success) {
      message.success("Resolved");

      setData((prev) =>
        prev.map((item) =>
          item._id === selectedDoc._id
            ? {
                ...item,
                status: "Resolved",
                signedFile: dataRes.data.signedFile,
              }
            : item
        )
      );

      setSelectedDoc((prev) => ({
        ...prev,
        status: "Resolved",
        signedFile: dataRes.data.signedFile,
      }));

      setOpen(false);
    } else {
      message.error(dataRes.message || "Upload failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${id}/reject`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const dataRes = await res.json();

      if (dataRes.success) {
        message.warning("Rejected");
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        message.error(dataRes.message || "Reject failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const dataRes = await res.json();

      if (dataRes.success) {
        message.success("Deleted");
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        message.error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error");
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
              text === "Resolved"
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

          {selectedDoc?.signedFile ? (
            <div style={{ marginBottom: "10px" }}>
              <p><strong>Signature:</strong></p>
              <img
                src={`http://localhost:5000/uploads/${selectedDoc.signedFile}`}
                width="150"
                style={{ border: "1px solid #000000", padding: "5px" }}
                alt="signature"
              />
            </div>
          ) : (
            <p></p>
          )}

          {/* File Upload */}
          <input
            type="file"
            onChange={(e) =>
              setSelectedDoc({
                ...selectedDoc,
                file: e.target.files[0],
              })
            }
          />

          <br /><br />

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