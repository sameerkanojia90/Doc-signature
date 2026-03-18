import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 401) {
          setAllowed(false);
        } else {
          return res.json();
        }
      })
      .then(data => {
        if (data?.user) {
          if (!role || data.user.role === role) {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        }
      })
      .catch(() => setAllowed(false))
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) return <p>Loading...</p>;

  return allowed ? children : <Navigate to="/" />;
}

export default ProtectedRoute;