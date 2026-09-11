import PropTypes from "prop-types";
import DashboardCard from "./DashboardCard.jsx";

const ActivityCard = ({ days }) => {
  const maxMinutes = Math.max(...days.map((day) => day.minutes), 1);

  return (
    <DashboardCard
      title="Activity"
      action={
        <span className="font-mono text-xs text-slate-500">Last 14 days</span>
      }
      bodyClassName="px-5 pb-4 pt-5 sm:px-6"
    >
      <div
        className="flex h-28 items-end gap-1 sm:h-32"
        role="img"
        aria-label="Bar chart of minutes logged over the last 14 days"
      >
        {days.map((day) => (
          <div
            key={day.key}
            title={day.tooltip}
            className="flex h-full min-w-0 flex-1 flex-col justify-end"
          >
            {day.minutes > 0 && (
              <div
                className="w-full rounded-t-[3px] bg-green-600"
                style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1">
        {days.map((day) => (
          <span
            key={day.key}
            className="min-w-0 flex-1 text-center font-mono text-[9px] text-slate-400 sm:text-[10px]"
          >
            {day.weekday}
          </span>
        ))}
      </div>
    </DashboardCard>
  );
};

ActivityCard.propTypes = {
  days: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      weekday: PropTypes.string.isRequired,
      minutes: PropTypes.number.isRequired,
      tooltip: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ActivityCard;
