import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Empty,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
} from "antd";
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import "../../App.css";

function NewDocDocuments() {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtList, setCourtList] = useState([]);
  const [officerMap, setOfficerMap] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/admin/courts-officers")
      .then((res) => res.json())
      .then((data) => {
        setCourtList(data.courts);
        setOfficerMap(data.officers);
      })
      .catch((err) => console.error("Error fetching courts/officers:", err));
  }, []);

  const handleDownloadTemplate = () => {
    const headers = ["Case ID", "Signature", "Date", "Request Status", "Court Reference"];
    const sampleData = [headers];
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "BulkUploadTemplate.xlsx");
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const finalData = jsonData.map((item, index) => ({
        key: Date.now() + index,
        caseId: item["Case ID"],
        signature: item["Signature"],
        date: item["Date"],
        status: "Pending",
        courtRef: item["Court Reference"],
      }));

      setTableData(finalData);
      message.success("File uploaded successfully!");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSendClick = (record) => {
    setSelectedRecord(record);
    setSelectedCourt(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (values) => {
    const updatedData = tableData.map((item) =>
      item.key === selectedRecord.key
        ? { ...item, status: `Sent to ${values.officer} (${values.court})` }
        : item
    );
    setTableData(updatedData);
    message.success(`Case ${selectedRecord.caseId} sent to Officer: ${values.officer}`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (recordKey) => {
    setTableData(tableData.filter((item) => item.key !== recordKey));
  };

  const columns = [
    { title: "Case ID", dataIndex: "caseId", key: "caseId" },
    { title: "Signature", dataIndex: "signature", key: "signature" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span className={text.startsWith("Sent") ? "status-sent" : "status-pending"}>
          {text}
        </span>
      ),
    },
    { title: "Court Reference", dataIndex: "courtRef", key: "courtRef" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            disabled={record.status.startsWith("Sent")}
            onClick={() => handleSendClick(record)}
          >
            Send
          </Button>
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="doc-container">
      <div className="doc-header">
        <h2>Documents INFO</h2>
        <div className="doc-buttons">
          <label htmlFor="fileUpload">
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => document.getElementById("fileUpload").click()}
            >
              Upload
            </Button>
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
            Download Bulk Upload Format
          </Button>
        </div>
      </div>

      <Table
        dataSource={tableData}
        columns={columns}
        locale={{ emptyText: <Empty description="No data" /> }}
        pagination={false}
        bordered
      />

      <Modal
        title="Send Case to Officer"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="court"
            label="Select Court"
            rules={[{ required: true, message: "Please select a court" }]}
          >
            <Select
              placeholder="Choose a court"
              onChange={(value) => {
                setSelectedCourt(value);
                form.setFieldsValue({ officer: undefined });
              }}
            >
              {courtList.map((court) => (
                <Select.Option key={court} value={court}>
                  {court}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="officer"
            label="Select Officer"
            rules={[{ required: true, message: "Please select an officer" }]}
          >
            <Select placeholder="Choose an officer" disabled={!selectedCourt}>
              {selectedCourt &&
                officerMap[selectedCourt]?.map((officer) => (
                  <Select.Option key={officer} value={officer}>
                    {officer}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default NewDocDocuments;
