
// import { Modal, Form, Input, Upload, Button, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import SampleDownload from "./SampleDownload";
// import "../../App.css";

// function CreateRequestModal({ visible, onCancel, onCreate }) {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     if (!values.file || !values.file[0]) {
//       return message.error("Template file is required");
//     }
//     onCreate(values);
//     form.resetFields();
//   };

//   return (
//     <Modal
//       title="Create new request"
//       open={visible}
//       onCancel={onCancel}
//       onOk={() => form.submit()}
//       okText="Create"
//     >
//       <Form form={form} layout="vertical" onFinish={handleFinish}>
//         <Form.Item
//           label="Request Title"
//           name="title"
//           rules={[{ required: true, message: "Please enter request title" }]}
//         >
//           <Input placeholder="Enter request title" />
//         </Form.Item>

//         <Form.Item
//           label="Request Description"
//           name="description"
//           rules={[{ required: true, message: "Please enter request description" }]}
//         >
//           <Input.TextArea rows={3} placeholder="Enter request description" />
//         </Form.Item>

//         <Form.Item
//           label="Request Template File"
//           name="file"
//           valuePropName="fileList"
//           getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
//           rules={[{ required: true, message: "Please upload a template file" }]}
//         >
//           <Upload beforeUpload={() => false} maxCount={1}>
//             <Button icon={<UploadOutlined />}>Upload File</Button>
//           </Upload>
//         </Form.Item>

//         <p className="request-note">
//           <strong>Note:</strong> {"{Case id}, {Address}, {Signature}, {Delegation Message}"} must
//           be present. {"{Court}"} and {"{Reference Number}"} are optional.
//         </p>

//         <SampleDownload />
//       </Form>
//     </Modal>
//   );
// }

// export default CreateRequestModal;
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SampleDownload from "./SampleDownload";
import "../../App.css";

function CreateRequestModal({ visible, onCancel, onCreate }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    if (!values.file || !values.file[0]) {
      return message.error("Template file is required");
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("file", values.file[0].originFileObj);
    formData.append("officerId", values.officerId);

    onCreate(formData);
    form.resetFields();
  };

  return (
    <Modal
      title="Create new request"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Create"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        
        <Form.Item
          label="Request Title"
          name="title"
          rules={[{ required: true, message: "Please enter request title" }]}
        >
          <Input placeholder="Enter request title" />
        </Form.Item>

        <Form.Item
          label="Request Description"
          name="description"
          rules={[{ required: true, message: "Please enter request description" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter request description" />
        </Form.Item>

        {/* 🔥 NEW FIELD */}
        <Form.Item
          label="Assign Officer (ID)"
          name="officerId"
          rules={[{ required: true, message: "Please enter officer ID" }]}
        >
          <Input placeholder="Enter Officer ID" />
        </Form.Item>

        <Form.Item
          label="Request Template File"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload a template file" }]}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </Form.Item>

        <p className="request-note">
          <strong>Note:</strong> {"{Case id}, {Address}, {Signature}, {Delegation Message}"} must
          be present. {"{Court}"} and {"{Reference Number}"} are optional.
        </p>

        <SampleDownload />
      </Form>
    </Modal>
  );
}

export default CreateRequestModal;