// import { useLocation, useNavigate } from "react-router-dom";
// import { Card, Button } from "antd";
// import "../../App.css";

// function DocumentPreview() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   if (!state || !state.document) {
//     return <p className="no-document">No document data found.</p>;
//   }

//   const { document } = state;

//   return (
//     <div className="document-preview-page">
//       <h2 className="document-header">Document Preview</h2>

//       <Button className="view-all-btn" onClick={() => navigate("/newdocdocuments")}>
//         View All Documents
//       </Button>

//       <Card title="Document Details" bordered={false} className="document-card">
//         <p><strong>Title:</strong> {document.title}</p>
//         <p><strong>Description:</strong> {document.description}</p>
//         <p><strong>Number of Documents:</strong> {document.numDocs}</p>
//         <p><strong>Rejected Documents:</strong> {document.rejectedDocs}</p>
//         <p><strong>Created At:</strong> {document.createdAt}</p>
//         <p><strong>Status:</strong> {document.status}</p>
//       </Card>

//       <div className="back-btn-container">
//         <Button type="primary" onClick={() => navigate(-1)}>
//           Back to Requests
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default DocumentPreview;
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import "../../App.css";

function DocumentPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.document) {
    return <p className="no-document">No document data found.</p>;
  }

  const { document } = state;

  return (
    <div className="document-preview-page">
      <h2 className="document-header">Document Preview</h2>

      {/* Buttons at top */}
      <div className="top-buttons" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Button type="primary" onClick={() => navigate(-1)}>
          Back to Requests
        </Button>
        <Button onClick={() => navigate("/newdocdocuments")}>
          View All Documents
        </Button>
      </div>

      <Card title="Document Details" bordered={false} className="document-card">
        <p><strong>Title:</strong> {document.title}</p>
        <p><strong>Description:</strong> {document.description}</p>
        <p><strong>Number of Documents:</strong> {document.numDocs}</p>
        <p><strong>Rejected Documents:</strong> {document.rejectedDocs}</p>
        <p><strong>Created At:</strong> {document.createdAt}</p>
        <p><strong>Status:</strong> {document.status}</p>
      </Card>
    </div>
  );
}

export default DocumentPreview;
