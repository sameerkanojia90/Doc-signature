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
        const res = await fetch("http://localhost:5000/api/requests" , {
          credentials:"include",
        }    );
        
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        if (data.success) {
          setDocuments(
            data.data.map((doc) => ({
              _id: doc._id, 
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
    const file = values.file?.[0]?.originFileObj;

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
      message.success("Created successfully");
    } else {
      message.error(data.message);
    }

  } catch (err) {
    console.error(err);
  }
};

  const handleDelete = async (id) => {
  try {
    console.log("Deleting ID:", id);

    const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();
    console.log("DELETE RESPONSE:", data);

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
