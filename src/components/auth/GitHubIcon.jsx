import PropTypes from "prop-types";

// GitHub brand mark, served from the static icons folder
// (lucide-react no longer ships brand icons).
const GitHubIcon = ({ className = "h-5 w-5" }) => (
  <img
    src="/icons/github-icon.png"
    alt=""
    aria-hidden="true"
    className={`${className} shrink-0`}
  />
);

GitHubIcon.propTypes = {
  className: PropTypes.string,
};

export default GitHubIcon;