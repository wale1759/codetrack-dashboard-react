const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateSignInForm(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateSignUpForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Your name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Create a password.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}
