import { Modal, Input, Button, Select } from "antd";
import { useState } from "react";
import "../App.css"; // ✅ Import CSS

const { Option } = Select;

export default function MemberModal({ visible, onClose, onSubmit, court }) {
    const [role, setRole] = useState("Reader");
    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");

    const handleSubmit = () => {
        if (!email || !pass) return alert("Email and password are required!");
        onSubmit({ email, pass, role });
        setRole("Reader");
        setEmail("");
        setPassword("");
    };

    return (
        <Modal
            title={`Add Member to ${court?.name}`}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <div className="member-modal-container">
                <div className="member-modal-field">
                    <label>Role</label>
                    <Select value={role} onChange={setRole} className="member-select">
                        <Option value="Reader">Reader</Option>
                        <Option value="Officer">Officer</Option>
                    </Select>
                </div>

                <div className="member-modal-field">
                    <label>Email</label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <div className="member-modal-field">
                    <label>Password</label>
                    <Input
                        type="password"
                        value={pass}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
            </div>

            <div className="member-modal-actions">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </Modal>
    );
}
