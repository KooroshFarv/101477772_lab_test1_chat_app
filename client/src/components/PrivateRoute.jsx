import { Navigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}
