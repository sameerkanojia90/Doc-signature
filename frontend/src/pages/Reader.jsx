import { useState, useEffect } from "react";
import { Button, message, Upload } from "antd";
import CreateRequestModal from "../component/reader/CreateRequestModel";
import DocumentTable from "../component/reader/DocumentTable";
import "../App.css";

function Reader() {
  const [visible, setVisible] = useState(false);
  const [documents, setDocuments] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests" , {
        credentials:"include",
      }   );
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
    if (!values.file || values.file.length === 0) {
      return message.error("Please select a template file (.docx)");
    }

    const file = values.file[0].originFileObj;

    if (!file) {
      return message.error("File not found");
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("templateFile", file);

    const res = await fetch("http://localhost:5000/api/requests", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    console.log("UPLOAD RESPONSE:", data);

    if (data.success) {
      message.success("Request created successfully");
      fetchRequests();
      setVisible(false);
    } else {
      message.error(data.message || "Upload failed");
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
