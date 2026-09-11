import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ArrowRight, SquarePen, Zap } from "lucide-react";
import DashboardCard from "./DashboardCard.jsx";

const TAG_CHIP_TONES = {
  green: "bg-green-100 text-green-800",
  slate: "bg-slate-100 text-slate-600",
};

// Known tags keep the tone used in the mockups; unknown tags get a stable
// tone derived from the tag name.
const TAG_TONES = {
  react: "green",
  "css-grid": "green",
  javascript: "green",
  html: "green",
  tailwind: "green",
  algorithms: "slate",
  sql: "slate",
  typescript: "slate",
  python: "slate",
};

const tagTone = (tag) => {
  if (TAG_TONES[tag]) return TAG_TONES[tag];
  const weight = [...tag].reduce((total, char) => total + char.charCodeAt(0), 0);
  return weight % 2 === 0 ? "green" : "slate";
};

const RecentLogCard = ({ logs, todayMinutes }) => {
  const isEmptyToday = todayMinutes === 0;

  return (
    <DashboardCard
      title="Recent log"
      bodyClassName="p-0"
      action={
        <Link
          to="/log"
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <SquarePen aria-hidden="true" className="h-4 w-4" />
          Add entry
        </Link>
      }
    >
      <div
        className={`mx-5 flex items-center gap-3 rounded-lg border border-dashed border-green-300 bg-green-50 p-4 sm:mx-6 ${
          logs.length > 0 ? "mt-5" : ""
        }`}
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-green-600 shadow-sm"
        >
          <Zap className="h-5 w-5" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-green-900">
            {isEmptyToday
              ? "Nothing logged yet today."
              : `Logged ${todayMinutes} min today.`}
          </p>
          <Link
            to="/log"
            className="mt-0.5 inline-flex items-center gap-1 font-semibold text-green-700 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            {isEmptyToday ? "Log your first 20 minutes" : "Add another session"}
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {logs.length > 0 && (
        <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
            >
              <span
                className={`shrink-0 rounded-md px-2 py-1 font-mono text-xs font-medium ${TAG_CHIP_TONES[tagTone(log.tag)]}`}
              >
                # {log.tag}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {log.title}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  {log.when}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs text-slate-500">
                {log.durationMinutes} min
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
};

RecentLogCard.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      durationMinutes: PropTypes.number.isRequired,
      when: PropTypes.string.isRequired,
    }),
  ).isRequired,
  todayMinutes: PropTypes.number.isRequired,
};

export default RecentLogCard;
