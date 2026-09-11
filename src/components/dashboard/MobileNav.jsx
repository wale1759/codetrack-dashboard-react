import { Link, useLocation } from "react-router-dom";
import { DASHBOARD_NAV_ITEMS } from "./navItems.js";

const MOBILE_NAV_ITEMS = DASHBOARD_NAV_ITEMS.filter(
  ({ key }) => key !== "settings",
);

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {MOBILE_NAV_ITEMS.map(({ key, label, to, Icon }) => {
          const isActive = to !== undefined && location.pathname === to;
          const itemClasses = `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-600 ${
            isActive ? "text-green-600" : "text-slate-500"
          }`;

          return (
            <li key={key}>
              {to ? (
                <Link
                  to={to}
                  className={itemClasses}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  {label}
                </Link>
              ) : (
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  aria-disabled="true"
                  title="Coming soon"
                  className={`${itemClasses} cursor-default text-slate-400`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNav;
