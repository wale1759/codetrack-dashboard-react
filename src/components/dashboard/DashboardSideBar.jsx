import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Logo from "../auth/Logo.jsx";
import { DASHBOARD_NAV_ITEMS } from "./navItems.js";

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const DashboardSidebar = ({ user }) => {
  const location = useLocation();
  const displayName = user?.display_name ?? "Guest";
  const plan = user?.plan ?? "free";
  const planLabel = `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan`;

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="px-5 py-5">
        <Logo tone="dark" />
      </div>
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {DASHBOARD_NAV_ITEMS.map(({ key, label, to, Icon }) => {
            const isActive = to !== undefined && location.pathname === to;
            const itemClasses = `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-600 ${
              isActive
                ? "bg-green-50 font-semibold text-green-700"
                : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`;

            return (
              <li key={key}>
                {to ? (
                  <Link
                    to={to}
                    className={itemClasses}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {label}
                  </Link>
                ) : (
                  <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    aria-disabled="true"
                    title="Coming soon"
                    className={`${itemClasses} cursor-default text-slate-400 hover:bg-transparent hover:text-slate-400`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
          >
            {getInitials(displayName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">{planLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

DashboardSidebar.propTypes = {
  user: PropTypes.shape({
    display_name: PropTypes.string,
    plan: PropTypes.string,
  }),
};

export default DashboardSidebar;

