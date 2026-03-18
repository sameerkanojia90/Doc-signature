import { useState, useEffect } from "react";
import { Button, message } from "antd";
import CreateRequestModal from "./CreateRequestModal";
import DocumentTable from "./DocumentTable";
import "../../App.css";

function DocumentManager() {
  const [visible, setVisible] = useState(false);
  const [documents, setDocuments] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      if (data.success) {
        setDocuments(
          data.data.map((doc) => ({
            key: doc._id,
            title: doc.Doctitle || "-",
            description: doc.Description || "-",
            numDocs: doc.numberOfDocuments || 0,
            rejectedDocs: doc.rejectedDocuments || 0,
            createdAt: doc.createdAt
              ? new Date(doc.createdAt).toISOString().split("T")[0]
              : "-",
            lastActivity: "-",
            status: "Pending",
          }))
        );
      } else {
        message.error(data.message || "Failed to fetch requests");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreate = async (values) => {
    try {
      if (!values.file || values.file.length === 0) {
        message.error("Please select a file to upload");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("templateFile", values.file[0].originFileObj);

      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        message.success("Request created successfully");
        fetchRequests();
        setVisible(false);
      } else {
        message.error(data.message || "Failed to create request");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        message.success("Request deleted successfully");
        fetchRequests();
      } else {
        message.error(data.message || "Failed to delete request");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="document-manager-page">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        DOCUMENT REQUESTS
      </h1>

      <div className="document-manager">
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          style={{ marginBottom: "20px" }}
        >
          Create New Request
        </Button>

        <DocumentTable data={documents} onDelete={handleDelete} />

        <CreateRequestModal
          visible={visible}
          onCancel={() => setVisible(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}

export default DocumentManager;
