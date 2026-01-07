import React, { useState, useEffect } from "react";
import Header from "./Header";
import Table from "./CreateTable";
import { Card } from "antd";
import { FaArrowRight } from "react-icons/fa";
import "../App.css"; // ✅ Import global styles

function InfoCard({ title, value }) {
  return (
    <Card className="info-card">
      <div className="info-card-content">
        <div>
          <h1 className="info-card-title">{title}</h1>
          <p className="info-card-value">{value}</p>
        </div>
        <FaArrowRight className="info-card-icon" />
      </div>
    </Card>
  );
}

function Admin() {
  const [stats, setStats] = useState({
    courts: 0,
    readers: 0,
    officers: 0,
    signedDocs: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardsData = [
    { title: "Courts", value: stats.courts },
    { title: "Reader", value: stats.readers },
    { title: "Officers", value: stats.officers },
    { title: "Document Signed", value: stats.signedDocs },
  ];

  return (
    <>
      <Header />
      <div className="admin-grid">
        {cardsData.map((card, index) => (
          <InfoCard key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <Table onUpdateStats={fetchStats} />
    </>
  );
}

export default Admin;
