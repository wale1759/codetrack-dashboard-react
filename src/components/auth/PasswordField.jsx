import { useState } from "react";
import PropTypes from "prop-types";
import TextField from "./TextField.jsx";

const PasswordField = (props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible((visible) => !visible);

  return (
    <TextField
      {...props}
      type={isPasswordVisible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={toggleVisibility}
          aria-pressed={isPasswordVisible}
          className="rounded font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </button>
      }
    />
  );
};

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helper: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
};

export default PasswordField;
