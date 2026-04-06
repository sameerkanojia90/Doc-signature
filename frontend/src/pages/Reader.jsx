import { useState, useEffect } from "react";
import { Button, message } from "antd";
import CreateRequestModel from "../component/reader/CreateRequestModel";
import DocumentTable from "../component/reader/DocumentTable";
import "../App.css";

function Reader() {
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        credentials: "include",
      });
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

  const handleCreate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("templateFile", values.file[0].originFileObj);

      const res = await fetch("http://localhost:5000/api/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("requestId", data.data._id);
        setIsModalOpen(false);
        fetchRequests();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="reader-container">
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create New Request
      </Button>

      <DocumentTable data={documents} />

      <CreateRequestModel
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default Reader;