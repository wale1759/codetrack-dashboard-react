import PropTypes from "prop-types";
import { CircleCheck } from "lucide-react";
import Logo from "./Logo.jsx";

const AuthHeroPanel = ({ title, description, footnote }) => (
  <section className="flex h-fit w-full flex-col items-start bg-slate-900 p-8 sm:p-10 lg:p-12">
    <Logo />
    <img
      src="/image/auth-heat-map.png"
      alt=""
      aria-hidden="true"
      className="mt-3 w-full max-w-[440px]"
    />
    <h2 className="mt-10 font-mono text-3xl font-bold tracking-tight text-white lg:text-4xl">
      {title}
    </h2>
    <p className="mt-4 max-w-[430px] text-base leading-relaxed text-slate-400">
      {description}
    </p>
    <p className="mt-5 flex items-center gap-2 text-sm text-slate-300">
      <CircleCheck aria-hidden="true" className="h-4 w-4 text-green-500" />
      {footnote}
    </p>
  </section>
);

AuthHeroPanel.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  footnote: PropTypes.string.isRequired,
};

export default AuthHeroPanel;
