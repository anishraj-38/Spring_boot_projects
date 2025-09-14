import {authSevice as result} from "../services/auth.service.js"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Dummy authentication (replace with real logic)
  const isAuthenticated = XPathResult.isAuthenticated()


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
