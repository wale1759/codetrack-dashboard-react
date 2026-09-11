import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { validateSignUpForm } from "../utils/validation.js";

const SOCIAL_AUTH_NOTICE = "Social sign-up isn't wired up in this simulation yet.";

const SignUpPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [notice, setNotice] = useState(null);

  const updateField = (field) => (event) => {
    const nextForm = { ...form, [field]: event.target.value };
    setForm(nextForm);
    setNotice(null);
    // Once a field has been touched (or a submit was attempted), validate live.
    if (touchedFields[field]) {
      setErrors(validateSignUpForm(nextForm));
    }
  };

  const handleBlur = (field) => () => {
    setTouchedFields((previous) => ({ ...previous, [field]: true }));
    setErrors(validateSignUpForm(form));
  };

  const showError = (field) => (touchedFields[field] ? errors[field] : undefined);

  const showNotice = (tone, message) => setNotice({ tone, message });

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateSignUpForm(form);
    setErrors(nextErrors);
    setTouchedFields({ name: true, email: true, password: true });
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = signUp({
      displayName: form.name,
      email: form.email,
      password: form.password,
    });
    if (!result.success) {
      showNotice("error", result.message);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <AuthLayout
      mobileTagline="Day 1 starts here."
      heroTitle="Day 1 starts here."
      heroDescription="Create your account and log your first session today. Tomorrow, you'll have a 2-day streak."
      heroFootnote="Free forever for your daily log."
    >
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-2 text-slate-500">Start your streak in under a minute.</p>

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
            label="Name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Alex Rivera"
            value={form.name}
            onChange={updateField("name")}
            onBlur={handleBlur("name")}
            error={showError("name")}
          />
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            helper="Use at least 8 characters."
            value={form.password}
            onChange={updateField("password")}
            onBlur={handleBlur("password")}
            error={showError("password")}
          />
        </div>
        <Button type="submit" variant="primary" className="mt-7">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-sm leading-relaxed text-slate-500">
        By signing up you agree to our{" "}
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="rounded font-medium text-teal-700 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="rounded font-medium text-teal-700 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Privacy Policy
        </a>
        .
      </p>

      <p className="mt-9 text-center text-sm text-slate-700">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="rounded font-semibold text-teal-700 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Log in.
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
