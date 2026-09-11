import PropTypes from "prop-types";

const MetricCard = ({
  icon: Icon,
  iconClassName = "",
  label,
  value,
  unit,
  unitClassName = "text-slate-900",
  footnote,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <Icon aria-hidden="true" className={`h-4 w-4 ${iconClassName}`} />
      {label}
    </p>
    <p className="mt-3 flex items-baseline gap-2">
      <span className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {value}
      </span>
      {unit && (
        <span className={`font-mono text-xl font-bold sm:text-2xl ${unitClassName}`}>
          {unit}
        </span>
      )}
    </p>
    {footnote && <p className="mt-2 text-sm text-slate-500">{footnote}</p>}
  </div>
);

MetricCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  iconClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  unitClassName: PropTypes.string,
  footnote: PropTypes.string,
};

export default MetricCard;

