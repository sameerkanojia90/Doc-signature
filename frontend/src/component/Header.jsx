import { Divider, Button } from "antd";
import { LuBell } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css"; // ✅ import CSS

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const isCourtInfo = location.pathname.startsWith("/court/");
    const isAdmin = location.pathname.startsWith("/admin");

    const handleLogout = () => {
        console.log("Logout clicked");
        navigate("/");
    };

    return (
        <div className="header-container">
            <h1 className="header-title">DocSignature</h1>

            <div className="header-right">
                <LuBell size={22} />
                <Divider type="vertical" className="header-divider" />

                {/* Back Button (Court Info page par) */}
                {isCourtInfo && (
                    <Button type="primary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                )}

                {/* Logout Button (Admin side par) */}
                {isAdmin && (
                    <Button danger onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Header;
