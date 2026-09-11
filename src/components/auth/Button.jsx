import PropTypes from "prop-types";

const BUTTON_BASE_CLASSES =
  "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60";

const BUTTON_VARIANT_CLASSES = {
  primary:
    "bg-green-600 font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline-green-700",
  outline:
    "border border-slate-300 bg-white font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-green-600",
};

const Button = ({ variant = "primary", className = "", children, ...props }) => (
  <button
    className={`${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "outline"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
