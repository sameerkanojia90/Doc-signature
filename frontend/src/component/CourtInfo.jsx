

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Spin, Table, Tag, Tabs } from "antd";
import Header from "./Header";
import "../App.css";

const { TabPane } = Tabs;

function CourtInfo() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await fetch(`http://localhost:5000/court/${id}`);
        const data = await res.json();
        if (data.success) setCourt(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id]);

  if (loading)
    return (
      <div className="court-loading">
        <Spin size="large" />
      </div>
    );

  if (!court) return <h2 className="court-not-found">Court not found</h2>;

  // Members columns
  const columns = [
    { title: "No.", dataIndex: "no", key: "no", render: (_, __, i) => i + 1 },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Joining Date", dataIndex: "joiningDate", key: "joiningDate" },
    { title: "Documents Issued", dataIndex: "documentsIssued", key: "documentsIssued" },
    { title: "Documents Verified", dataIndex: "documentsVerified", key: "documentsVerified" },
  ];

  return (
    <>
      <Header />
      <div className="court-container">
        {/* <Card className="court-info-card" title="Court Information">
          <table className="court-info-table">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{court.name}</td>
                <td>Location</td>
                <td>{court.location}</td>
                <td>Documents Not Signed</td>
                <td>{court.documentsNotSigned}</td>
              </tr>
              <tr>
                <td>Total Officers</td>
                <td>{court.officersCount}</td>
                <td>Total Readers</td>
                <td>{court.readersCount}</td>
                <td>Documents Signed</td>
                <td>{court.documentsSigned}</td>
              </tr>
              <tr>
                <td colSpan={6}>
                  Description: {court.description || "No description available"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card> */}

    <Card className="court-info-card" title="Court Information">
  <div className="court-info-grid">
    <div className="court-info-row">
      <div className="court-info-label">Name</div>
      <div className="court-info-value">{court.name}</div>
      <div className="court-info-label">Location</div>
      <div className="court-info-value">{court.location}</div>
      <div className="court-info-label">Documents Not Signed</div>
      <div className="court-info-value">{court.documentsNotSigned}</div>
    </div>

    <div className="court-info-row">
      <div className="court-info-label">Total Officers</div>
      <div className="court-info-value">{court.officersCount}</div>
      <div className="court-info-label">Total Readers</div>
      <div className="court-info-value">{court.readersCount}</div>
      <div className="court-info-label">Documents Signed</div>
      <div className="court-info-value">{court.documentsSigned}</div>
    </div>
  </div>

  <div className="court-info-description">
    <strong>Description:</strong> {court.description || "No description available"}
  </div>
</Card>


        <Card className="court-members-card" title="Member Details">
          <Tabs defaultActiveKey="readers">
            <TabPane tab="Readers" key="readers">
              <Table
                columns={columns}
                dataSource={court.members?.filter(m => m.role.toLowerCase() === "reader") || []}
                rowKey={(record, i) => i}
                pagination={false}
                bordered
              />
            </TabPane>
            <TabPane tab="Officers" key="officers">
              <Table
                columns={columns}
                dataSource={court.members?.filter(m => m.role.toLowerCase() === "officer") || []}
                rowKey={(record, i) => i}
                pagination={false}
                bordered
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </>
  );
}

export default CourtInfo;
