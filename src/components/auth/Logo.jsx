import PropTypes from "prop-types";

// The logo is composed from the existing grid-icon asset plus a text
// wordmark, so it renders correctly on both dark and light surfaces
// (the wordmark-only PNG is white text, which is invisible on white).
const Logo = ({
  tone = "light",
  iconClassName = "h-7 w-7",
  textClassName = "text-lg",
  className = "",
}) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <img
      src="/image/codetrack-favicon.png"
      alt=""
      aria-hidden="true"
      className={`${iconClassName} shrink-0`}
    />
    <span
      className={`${textClassName} font-bold tracking-tight ${
        tone === "light" ? "text-white" : "text-slate-900"
      }`}
    >
      Code<span className="text-green-500">Track</span>
    </span>
  </span>
);

Logo.propTypes = {
  tone: PropTypes.oneOf(["light", "dark"]),
  iconClassName: PropTypes.string,
  textClassName: PropTypes.string,
  className: PropTypes.string,
};

export default Logo;

