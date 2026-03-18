import { Card, Input, Button } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; 
import "../App.css"; 
function Login() {
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const API = "http://localhost:5000/login";

    function changeRole(selectedRole) {
        setRole(selectedRole);
    }

   async function handleLogin() {
    try {
        const res = await fetch(API, {
            credentials: "include",
            method: "POST",
            
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();
        console.log("Login Response:", data);

        if (data.success) {
            const userRole = data.user.role;

            if (userRole === "Admin") {
                navigate("/admin");
            } else if (userRole === "Officer") {
                navigate("/Officer");
            } else if (userRole === "Reader") {
                navigate("/Reader");
            }
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

    return (
        <div className="login-container">
            <Card className="login-card">
                <h2 className="login-title">Login</h2>
                <div className="login-form">
                    <div className="input-group">
                        <label className="input-label">Enter Gmail</label>
                        <Input
                            placeholder="Enter Gmail"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Enter Password</label>
                        <Input
                            placeholder="Enter Password"
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            suffix={
                                showPassword ? (
                                    <EyeInvisibleOutlined
                                        onClick={() => setShowPassword(false)}
                                        style={{ cursor: "pointer" }}
                                    />
                                ) : (
                                    <EyeOutlined
                                        onClick={() => setShowPassword(true)}
                                        style={{ cursor: "pointer" }}
                                    />
                                )
                            }
                        />
                    </div>

                    <div className="role-buttons">
                        <Button
                            type={role === "Officer" ? "primary" : "default"}
                            onClick={() => changeRole("Officer")}
                        >
                            Officer
                        </Button>
                        <Button
                            type={role === "Reader" ? "primary" : "default"}
                            onClick={() => changeRole("Reader")}
                        >
                            Reader
                        </Button>
                        <Button
                            type={role === "Admin" ? "primary" : "default"}
                            onClick={() => changeRole("Admin")}
                        >
                            Admin
                        </Button>
                    </div>

                    <Button type="primary" className="login-btn" onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Login;
