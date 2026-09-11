import PropTypes from "prop-types";

// Official multicolor Google "G", served from the static icons folder
// (lucide-react no longer ships brand icons).
const GoogleIcon = ({ className = "h-5 w-5" }) => (
  <img
    src="/icons/google-icon.png"
    alt=""
    aria-hidden="true"
    className={`${className} shrink-0`}
  />
);

GoogleIcon.propTypes = {
  className: PropTypes.string,
};

export default GoogleIcon;
