import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

// ValidationLogs is a board showing the input validating status
const ValidationLogs = (props) => {
  const {
    emailValidation,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    repeatPasswordValidation,
  } = props.validationMessage;

  // List of pre-defined message for each of the categories
  const messages = {
    email: {
      empty: "Email cannot be empty",
      invalid: "Your email is invalid",
      valid: "Your email looks good",
    },
    firstName: {
      empty: "First name cannot be empty",
      valid: "Your first name looks good",
    },
    lastName: {
      empty: "Last name cannot be empty",
      valid: "Your last name looks good",
    },
    password: {
      empty: "Password cannot be empty",
      invalid: (
        <div>
          Your password is invalid. A valid password requires at least:
          <ul>
            <li>8 min letters</li>
            <li>a symbol (!@#$%^&*_-)</li>
            <li>mixture of uppercase and lowercase</li>
            <li>a number</li>
          </ul>
        </div>
      ),
      valid: "Your password looks good",
    },
    repeatPassword: {
      invalid: "Repeat password does not match",
      valid: "Repeat password looks good",
    },
  };

  return (
    <div>
      <Stack sx={{ width: "100%" }} spacing={1}>
        {/* --- Email validating */}
        {emailValidation === "empty" && (
          <Alert severity="error">{messages.email.empty}</Alert>
        )}
        {emailValidation === "invalid" && (
          <Alert severity="error">{messages.email.invalid}</Alert>
        )}
        {/* {emailValidation === "valid" && (
          <Alert severity="success">{messages.email.valid}</Alert>
        )} */}
        {/* --- First Name */}
        {firstNameValidation === "empty" && (
          <Alert severity="error">{messages.firstName.empty}</Alert>
        )}
        {/* {firstNameValidation === "valid" && (
          <Alert severity="success">{messages.lastName.valid}</Alert>
        )} */}
        {/* --- Last Name */}
        {lastNameValidation === "empty" && (
          <Alert severity="error">{messages.lastName.empty}</Alert>
        )}
        {/* {lastNameValidation === "valid" && (
          <Alert severity="success">{messages.lastName.valid}</Alert>
        )} */}
        {/* --- Password validating */}
        {passwordValidation === "empty" && (
          <Alert severity="error">{messages.password.empty}</Alert>
        )}
        {passwordValidation === "invalid" && (
          <Alert severity="error">{messages.password.invalid}</Alert>
        )}
        {/* {passwordValidation === "valid" && (
          <Alert severity="success">{messages.password.valid}</Alert>
        )} */}
        {/* --- Password validating */}

        {repeatPasswordValidation === "invalid" && (
          <Alert severity="error">{messages.repeatPassword.invalid}</Alert>
        )}
        {/* {repeatPasswordValidation === "valid" && (
          <Alert severity="success">{messages.repeatPassword.valid}</Alert>
        )} */}
      </Stack>
    </div>
  );
};

export default ValidationLogs;

ValidationLogs.propTypes = {
  validationMessage: PropTypes.object,
};
