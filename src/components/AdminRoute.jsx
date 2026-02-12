import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    // Tùy cách backend encode role
    const role =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role !== "Admin") {
      return <Navigate to="/" />;
    }

    return children;
  } catch {
    return <Navigate to="/login" />;
  }
}
