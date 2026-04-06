import React, { useState, useEffect } from "react";
import Header from "./Header";
import CreateTable from "./CreateTable";
import { Card } from "antd";
import { FaArrowRight } from "react-icons/fa";
import "../App.css";

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
  const [docCount, setDocCount] = useState(0);
  const [stats, setStats] = useState({
    courts: 0,
    readers: 0,
    officers: 0,
    signedDocs: 0,
  });

const fetchDocument = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/documents/all", {
      credentials: "include",
    });

    const data = await res.json();
    const count = data.data.length;

    console.log("Total Documents:", count);

    setDocCount(count);
  } catch (error) {
    console.log(error);
  }
};

useEffect(()=>{
  fetchDocument();
},[]);

  const fetchStats = async () => {
    try {
     const res = await fetch("http://localhost:5000/admin/stats", {
  credentials: "include"
});
      const data = await res.json();
      console.log(data);
      setStats(data.data || data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardsData = [
    { title: "Courts", value: stats.courts || 0 },
    { title: "Reader", value: stats.readers || 0 },
    { title: "Officers", value: stats.officers || 0 },
    { title: "Document Signed", value: docCount || 0 },
  ];

  return (
    <>
      <Header />
      <div className="admin-grid">
        {cardsData.map((card, index) => (
          <InfoCard key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <CreateTable onUpdateStats={fetchStats} />
    </>
  );
}

export default Admin;