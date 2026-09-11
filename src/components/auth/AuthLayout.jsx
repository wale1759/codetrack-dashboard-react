import PropTypes from "prop-types";
import AuthHeroPanel from "./AuthHeroPanel.jsx";
import Logo from "./Logo.jsx";

/**
 * Shared shell for the auth pages.
 * - Mobile: a single rounded card with a dark brand header strip on top.
 * - Desktop (lg+): a two-column split — form on the left, dark hero panel
 *   with the contribution heatmap on the right.
 */
const AuthLayout = ({
  mobileTagline,
  heroTitle,
  heroDescription,
  heroFootnote,
  children,
}) => (
  <main className="min-h-screen bg-white">
    <div className="mx-auto w-full max-w-[1360px] lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6">
      <div className="flex justify-center px-4 pb-12 pt-6 sm:px-6 lg:px-0 lg:py-16">
        <div className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 lg:max-w-[420px] lg:overflow-visible lg:rounded-none lg:shadow-none lg:ring-0">
          <header className="flex items-center justify-between gap-4 bg-slate-900 px-5 py-5 lg:hidden">
            <Logo />
            <p className="shrink-0 font-mono text-[11px] tracking-wide text-slate-400 sm:text-xs">
              {mobileTagline}
            </p>
          </header>
          <div className="px-6 py-9 sm:px-8 lg:px-0 lg:py-0">{children}</div>
        </div>
      </div>
      <aside className="hidden self-start lg:block">
        <AuthHeroPanel
          title={heroTitle}
          description={heroDescription}
          footnote={heroFootnote}
        />
      </aside>
    </div>
  </main>
);

AuthLayout.propTypes = {
  mobileTagline: PropTypes.string.isRequired,
  heroTitle: PropTypes.string.isRequired,
  heroDescription: PropTypes.string.isRequired,
  heroFootnote: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
