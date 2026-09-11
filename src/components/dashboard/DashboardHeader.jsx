import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Flame, Plus } from "lucide-react";

const DashboardHeader = ({
  greeting,
  firstName,
  dateLine,
  children = null,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {greeting}, {firstName}
      </h1>
      <p className="mt-1 font-mono text-xs text-slate-500 sm:text-sm">
        {dateLine}
      </p>
    </div>
    {children}
  </div>
);

// Streak badge + "Log today" pair. Rendered in the mobile top bar and again
// in the desktop header row (only one instance is visible at a time).
const DashboardHeaderActions = ({ streak, className = "" }) => (
  <div className={`items-center gap-2 sm:gap-3 ${className}`}>
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-1 font-mono text-[10px] font-medium text-amber-700 sm:px-3 sm:py-1.5 sm:text-xs">
      <Flame aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" />
      {streak}-day streak
    </span>
    <Link
      to="/log"
      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-3.5 sm:py-2 sm:text-sm"
    >
      <Plus aria-hidden="true" className="h-4 w-4" />
      Log today
    </Link>
  </div>
);

DashboardHeader.propTypes = {
  greeting: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  dateLine: PropTypes.string.isRequired,
  children: PropTypes.node,
};

DashboardHeaderActions.propTypes = {
  streak: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export { DashboardHeaderActions };
export default DashboardHeader;

