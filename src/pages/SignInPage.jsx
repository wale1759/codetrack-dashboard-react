import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthAlert from "../components/auth/AuthAlert.jsx";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Button from "../components/auth/Button.jsx";
import Divider from "../components/auth/Divider.jsx";
import GitHubIcon from "../components/auth/GitHubIcon.jsx";
import GoogleIcon from "../components/auth/GoogleIcon.jsx";
import PasswordField from "../components/auth/PasswordField.jsx";
import SocialButton from "../components/auth/SocialButton.jsx";
import TextField from "../components/auth/TextField.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { validateSignInForm } from "../utils/validation.js";

const SOCIAL_AUTH_NOTICE = "Social sign-in isn't wired up in this simulation yet.";
const PASSWORD_RESET_NOTICE = "Password reset isn't available in this simulation yet.";

const SignInPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [notice, setNotice] = useState(null);

  const updateField = (field) => (event) => {
    const nextForm = { ...form, [field]: event.target.value };
    setForm(nextForm);
    setNotice(null);
    // Once a field has been touched (or a submit was attempted), validate live.
    if (touchedFields[field]) {
      setErrors(validateSignInForm(nextForm));
    }
  };

  const handleBlur = (field) => () => {
    setTouchedFields((previous) => ({ ...previous, [field]: true }));
    setErrors(validateSignInForm(form));
  };

  const showError = (field) => (touchedFields[field] ? errors[field] : undefined);

  const showNotice = (tone, message) => setNotice({ tone, message });

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateSignInForm(form);
    setErrors(nextErrors);
    setTouchedFields({ email: true, password: true });
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = signIn(form.email, form.password);
    if (!result.success) {
      showNotice("error", result.message);
      return;
    }

    const redirectTo = location.state?.from?.pathname ?? "/";
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout
      mobileTagline="Your streak is waiting."
      heroTitle="Your streak is waiting."
      heroDescription="Sign in to log today's session. Every day you show up, your map gets a little greener."
      heroFootnote="Free forever for your daily log."
    >
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
      <p className="mt-2 text-slate-500">Sign in to keep your streak going.</p>

      {notice && (
        <AuthAlert tone={notice.tone} className="mt-6">
          {notice.message}
        </AuthAlert>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <SocialButton
          provider="GitHub"
          icon={<GitHubIcon className="h-5 w-5" />}
          onClick={() => showNotice("info", SOCIAL_AUTH_NOTICE)}
        />
        <SocialButton
          provider="Google"
          icon={<GoogleIcon className="h-5 w-5" />}
          onClick={() => showNotice("info", SOCIAL_AUTH_NOTICE)}
        />
      </div>

      <div className="my-8">
        <Divider>or</Divider>
      </div>

      <form noValidate onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField("email")}
            onBlur={handleBlur("email")}
            error={showError("email")}
          />
          <PasswordField
            label="Password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            value={form.password}
            onChange={updateField("password")}
            onBlur={handleBlur("password")}
            error={showError("password")}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => showNotice("info", PASSWORD_RESET_NOTICE)}
              className="rounded text-sm font-medium text-teal-700 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Forgot password?
            </button>
          </div>
        </div>
        <Button type="submit" variant="primary" className="mt-7">
          Sign in
        </Button>
      </form>

      <p className="mt-9 text-center text-sm text-slate-700">
        New to CodeTrack?{" "}
        <Link
          to="/signup"
          className="rounded font-semibold text-teal-700 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Create an account.
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignInPage;
