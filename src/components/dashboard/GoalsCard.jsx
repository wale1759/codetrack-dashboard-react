import PropTypes from "prop-types";
import DashboardCard from "./DashboardCard.jsx";

// Bar colors rotate through the palette used in the mockups.
const BAR_TONES = ["bg-green-600", "bg-teal-600", "bg-amber-500"];

const GoalsCard = ({ goals }) => (
  <DashboardCard title="Goals" bodyClassName="px-5 py-2 sm:px-6">
    <ul>
      {goals.map((goal, index) => (
        <li key={goal.id} className="py-3.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">{goal.title}</p>
            <p className="shrink-0 font-mono text-xs text-slate-500">
              {goal.current} of {goal.target} {goal.unit}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label={goal.title}
            aria-valuenow={goal.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className={`h-full rounded-full ${BAR_TONES[index % BAR_TONES.length]}`}
              style={{ width: `${goal.percent}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  </DashboardCard>
);

GoalsCard.propTypes = {
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      current: PropTypes.number.isRequired,
      target: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      percent: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default GoalsCard;
