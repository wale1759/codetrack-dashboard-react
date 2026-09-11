import { useId } from "react";
import PropTypes from "prop-types";

const TextField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  helper,
  required = false,
  autoComplete,
  placeholder,
  trailing = null,
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy =
    [error ? errorId : null, helper ? helperId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 transition-colors outline-none placeholder:text-slate-400 focus:ring-2 ${
            trailing ? "pr-16" : ""
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 hover:border-slate-400 focus:border-green-600 focus:ring-green-100"
          }`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {trailing}
          </div>
        )}
      </div>
      {helper && !error && (
        <p id={helperId} className="mt-2 text-sm text-slate-500">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  type: PropTypes.string,
  error: PropTypes.string,
  helper: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  trailing: PropTypes.node,
};

export default TextField;
