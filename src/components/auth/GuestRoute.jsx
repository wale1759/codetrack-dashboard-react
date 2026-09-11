import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Wraps guest-only routes (sign in / sign up). Signed-in users are bounced
 * back to the dashboard instead of seeing the auth forms again.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestRoute;
