import PropTypes from "prop-types";
import Button from "./Button.jsx";

const SocialButton = ({ provider, icon, onClick }) => (
  <Button type="button" variant="outline" onClick={onClick}>
    {icon}
    <span>Continue with {provider}</span>
  </Button>
);

SocialButton.propTypes = {
  provider: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func,
};

export default SocialButton;
