
import { useState, useEffect } from "react";
import { Button, message, Upload } from "antd";
import CreateRequestModal from "../component/reader/CreateRequestModel";
import DocumentTable from "../component/reader/DocumentTable";
import "../App.css";

function Reader() {
  const [visible, setVisible] = useState(false);
  const [documents, setDocuments] = useState([]);

  // ---------------- Fetch all requests ----------------
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      const data = await res.json();
      if (data.success) {
        setDocuments(
          data.data.map((doc) => ({
            key: doc._id,
            title: doc.Doctitle,
            description: doc.Description,
            numDocs: doc.numberOfDocuments || 0,
            rejectedDocs: doc.rejectedDocuments || 0,
            createdAt: doc.createdAt?.split("T")[0] || "-",
            lastActivity: "-",
            status: doc.status || "-",
          }))
        );
      } else {
        message.error(data.message || "Failed to load requests");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ---------------- Handle create request ----------------
  const handleCreate = async (values) => {
    try {
      if (!values.file || values.file.length === 0) {
        return message.error("Please select a template file (.docx)");
      }

      const fileObj = values.file[0];
      const file = fileObj.originFileObj || fileObj; // fallback for AntD Upload

      if (!file || !file.name) {
        return message.error("Invalid file selected");
      }

      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "docx") {
        return message.error("Only .docx files are allowed");
      }

      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("description", values.description || "");
      formData.append("templateFile", file);
      formData.append("createdById", "123"); // Replace with actual user ID
      formData.append("createrRole", "reader"); // Replace with actual role

      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        return message.error(data.message || "Bad request");
      }

      if (data.success) {
        message.success("Request created successfully");
        fetchRequests(); // Refresh table
        setVisible(false); // Close modal
      } else {
        message.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="reader-container">
      <Button type="primary" onClick={() => setVisible(true)}>
        Create New Request
      </Button>

      <DocumentTable data={documents} />

      <CreateRequestModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default Reader;
