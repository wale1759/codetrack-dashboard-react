import PropTypes from "prop-types";

const Divider = ({ children = "or" }) => (
  <div role="separator" className="flex items-center gap-4">
    <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
    <span className="text-sm text-slate-400">{children}</span>
    <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
  </div>
);

Divider.propTypes = {
  children: PropTypes.node,
};

export default Divider;
