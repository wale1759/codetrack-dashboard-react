import PropTypes from "prop-types";

const ALERT_TONE_CLASSES = {
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-amber-200 bg-amber-50 text-amber-800",
};

const AuthAlert = ({ tone = "error", className = "", children }) => (
  <div
    role="alert"
    className={`rounded-lg border px-4 py-3 text-sm font-medium ${ALERT_TONE_CLASSES[tone]} ${className}`}
  >
    {children}
  </div>
);

AuthAlert.propTypes = {
  tone: PropTypes.oneOf(["error", "info"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default AuthAlert;
