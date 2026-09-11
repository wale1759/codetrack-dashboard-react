import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const googleIcon = "/image/Signup-Mobile/SVG.png";
const githubIcon = "/image/Signup-Mobile/SVG (1).png";
const initialValues = { name: "", email: "", password: "", remember: false };

const Field = ({ label, name, type = "text", placeholder, value, error, onChange, autoComplete, className }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-[#171c22]" htmlFor={name}>{label} <span className="text-[#dc2635]">*</span></label>
    <input id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className={className} />
    {error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-[#bd2231]">{error}</p>}
  </div>
);

Field.propTypes = { label: PropTypes.string.isRequired, name: PropTypes.string.isRequired, type: PropTypes.string, placeholder: PropTypes.string.isRequired, value: PropTypes.string.isRequired, error: PropTypes.string, onChange: PropTypes.func.isRequired, autoComplete: PropTypes.string.isRequired, className: PropTypes.string.isRequired };

const AuthForm = ({ mode, onModeChange }) => {
  const { signIn, signUp } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "sign-up";
  const fieldClass = (name) => `h-[46px] w-full rounded-[10px] border bg-white px-[14px] text-[16px] text-[#171c22] outline-none transition placeholder:text-[#7d8084] focus:border-[#0ca956] focus:ring-2 focus:ring-[#0ca956]/20 ${errors[name] ? "border-[#dc3545]" : "border-[#dde2e4]"}`;

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (isSignup && values.name.trim().length < 2) nextErrors.name = "Enter a name with at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (values.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    const result = isSignup ? signUp({ displayName: values.name, email: values.email, password: values.password }) : signIn(values.email, values.password);
    if (!result.success) setErrors({ form: result.message });
  };

  const switchMode = () => { setValues(initialValues); setErrors({}); onModeChange(isSignup ? "sign-in" : "sign-up"); };

  return (
    <div className="w-full max-w-[400px] lg:mt-[52px]">
      <h1 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#171c22]">{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-1 text-[16px] text-[#697386]">{isSignup ? "Start your streak in under a minute." : "Log in to keep your streak going."}</p>
      <div className="mt-6 space-y-[10px]">{[{ label: "Continue with GitHub", icon: githubIcon }, { label: "Continue with Google", icon: googleIcon }].map(({ label, icon }) => <button key={label} type="button" className="flex h-[46px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#dde2e4] bg-white text-sm font-semibold text-[#171c22] transition hover:bg-[#f8faf9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ca956]"><img src={icon} alt="" className="h-[18px] w-[18px] object-contain" />{label}</button>)}</div>
      <div className="my-7 flex items-center gap-3 text-sm text-[#697386]"><span className="h-px flex-1 bg-[#e2e6e7]" />or<span className="h-px flex-1 bg-[#e2e6e7]" /></div>
      <form noValidate onSubmit={handleSubmit}>
        {errors.form && <p role="alert" className="mb-4 rounded-lg border border-[#f1b7bc] bg-[#fff2f3] px-3 py-2 text-sm text-[#ae1d2d]">{errors.form}</p>}
        <div className="space-y-4">
          {isSignup && <Field label="Name" name="name" placeholder="Alex Rivera" value={values.name} error={errors.name} onChange={updateField} autoComplete="name" className={fieldClass("name")} />}
          <Field label="Email" name="email" type="email" placeholder="you@example.com" value={values.email} error={errors.email} onChange={updateField} autoComplete="email" className={fieldClass("email")} />
          <div><label className="mb-1.5 block text-sm font-medium text-[#171c22]" htmlFor="password">Password <span className="text-[#dc2635]">*</span></label><div className="relative"><input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={isSignup ? "At least 8 characters" : "Your password"} value={values.password} onChange={updateField} autoComplete={isSignup ? "new-password" : "current-password"} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : isSignup ? "password-help" : undefined} className={`${fieldClass("password")} pr-14`} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-3 flex items-center text-[#697386] focus-visible:outline-2 focus-visible:outline-[#0ca956]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password ? <p id="password-error" role="alert" className="mt-1.5 text-sm text-[#bd2231]">{errors.password}</p> : isSignup && <p id="password-help" className="mt-1.5 text-sm text-[#697386]">Use at least 8 characters.</p>}</div>
        </div>
        {!isSignup && <div className="mt-4 flex items-center justify-between text-sm"><label className="flex cursor-pointer items-center gap-2 text-[#4b5565]"><input name="remember" type="checkbox" checked={values.remember} onChange={updateField} className="h-[18px] w-[18px] accent-[#16a957]" />Remember me</label><button type="button" className="text-[#009b8f] hover:underline focus-visible:outline-2 focus-visible:outline-[#0ca956]">Forgot password?</button></div>}
        <button type="submit" className="mt-5 h-[52px] w-full rounded-[10px] bg-[#16a957] text-[17px] font-bold text-white shadow-[0_10px_19px_rgba(22,169,87,0.25)] transition hover:bg-[#128e49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a8240]">{isSignup ? "Create account" : "Log in"}</button>
      </form>
      {isSignup && <p className="mt-4 text-sm leading-5 text-[#697386]">By signing up you agree to our <button type="button" className="text-[#009b8f] hover:underline">Terms</button> and <button type="button" className="text-[#009b8f] hover:underline">Privacy Policy</button>.</p>}
      <p className="mt-6 text-center text-[15px] text-[#4b5565]">{isSignup ? "Already have an account?" : "New here?"} <button type="button" onClick={switchMode} className="font-semibold text-[#009b8f] hover:underline focus-visible:outline-2 focus-visible:outline-[#0ca956]">{isSignup ? "Log in." : "Create an account."}</button></p>
    </div>
  );
};

AuthForm.propTypes = { mode: PropTypes.oneOf(["sign-in", "sign-up"]).isRequired, onModeChange: PropTypes.func.isRequired };
export default AuthForm;
