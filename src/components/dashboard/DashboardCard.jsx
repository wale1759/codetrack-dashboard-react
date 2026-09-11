import PropTypes from "prop-types";

/**
 * Shared white card with a title row and a hairline divider, matching the
 * dashboard mockups (heatmap, recent log, goals, activity cards).
 */
const DashboardCard = ({
  title,
  action = null,
  bodyClassName = "px-5 py-5 sm:px-6",
  children,
}) => (
  <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {action}
    </div>
    <div className={`border-t border-slate-100 ${bodyClassName}`}>
      {children}
    </div>
  </section>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.node,
  bodyClassName: PropTypes.string,
  children: PropTypes.node,
};

export default DashboardCard;
