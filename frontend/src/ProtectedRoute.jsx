import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          setIsAuth(false);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          const user = data.user || {}; 
          if (!role || user.role === role) {
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        }
      })
      .catch(() => setIsAuth(false))
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/" />;
}

export default ProtectedRoute;