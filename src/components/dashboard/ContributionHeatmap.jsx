import { Fragment } from "react";
import PropTypes from "prop-types";

// Index matches the 0–4 intensity level from dashboardMetrics.
const LEVEL_CLASSES = [
  "bg-slate-200",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

const ROW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VISIBLE_ROW_LABELS = new Set([1, 3, 5]); // Tue / Thu / Sat, like the design

const ContributionHeatmap = ({
  heatmap,
  showRowLabels = true,
  className = "",
}) => {
  const { weeks } = heatmap;
  const templateColumns = `${showRowLabels ? "24px" : "0px"} repeat(${weeks.length}, minmax(0, 1fr))`;

  return (
    <div
      className={className}
      role="img"
      aria-label="Contribution heatmap of daily learning minutes over the past year"
    >
      {/* One shared grid keeps month labels, weekday labels and cells aligned.
          Children are emitted row by row: labels row, then each of the 7 day rows. */}
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: templateColumns }}
      >
        <div />
        {weeks.map((week, weekIndex) => (
          <div key={`month-${weekIndex}`} className="relative">
            {week.label && (
              <span className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] leading-none text-slate-400">
                {week.label}
              </span>
            )}
          </div>
        ))}
        {ROW_LABELS.map((rowLabel, rowIndex) => (
          <Fragment key={rowLabel}>
            <div className="pt-0.5 font-mono text-[9px] leading-none text-slate-400">
              {showRowLabels && VISIBLE_ROW_LABELS.has(rowIndex) ? rowLabel : ""}
            </div>
            {weeks.map((week, weekIndex) => {
              const cell = week.days[rowIndex];
              if (!cell) {
                return (
                  <div key={`empty-${weekIndex}-${rowIndex}`} className="aspect-square w-full" />
                );
              }
              return (
                <div
                  key={`cell-${weekIndex}-${rowIndex}`}
                  title={cell.tooltip}
                  className={`aspect-square w-full rounded-[3px] ${LEVEL_CLASSES[cell.level]}`}
                />
              );
            })}
          </Fragment>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
        <span>Less</span>
        {LEVEL_CLASSES.map((levelClass) => (
          <span
            key={levelClass}
            aria-hidden="true"
            className={`h-[11px] w-[11px] rounded-[3px] ${levelClass}`}
          />
        ))}
        <span>More</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
        Hover any square to see that day's entries. Darker green means more
        logged.
      </p>
    </div>
  );
};

ContributionHeatmap.propTypes = {
  heatmap: PropTypes.shape({
    weeks: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        days: PropTypes.array,
      }),
    ).isRequired,
  }).isRequired,
  showRowLabels: PropTypes.bool,
  className: PropTypes.string,
};

export default ContributionHeatmap;
