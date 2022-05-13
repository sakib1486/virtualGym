/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

// Files
import "./ForgotPassword.css";
import ValidationLogs from "./ValidationLogs";
import logo from "../../images/vg-logo.png";

// eslint-disable-next-line no-unused-vars
import { clientId, address } from "../../utils/config";

// Material UI
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// Validate Password Input using Regex
const validatePassword = (password) => {
  // Regex to check for password matches
  // This regex checks for:
  // - 8 min letters
  // - at least a symbol character (!@#$%^&*_-)
  // - mixture of uppercase and lowercase letters
  // - at least a number
  const pattern = /^(?=.*\d)(?=.*[!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (password.match(pattern)) {
    return true;
  }
  return false;
};

// ForgotPassword component is responsible for the Forgot Password Page!
const ForgotPassword = () => {
  const [formInfo, setFormInfo] = useState({
    email: "",
    token: "",
    password: "",
    repeatPassword: "",
  });

  const [validationMessage, setValidationMessage] = useState({
    passwordValidation: "",
    repeatPasswordValidation: "",
  });

  const [resetToken, setResetToken] = useState("");

  // State is either:
  // - null
  // - "token"
  // - "new-password"
  const [resetState, setResetState] = useState();

  // Handle submitting email
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: formInfo.email,
    };
    axios
      .post(`${address}/reset-password/`, data)
      .then((response) => {
        setResetToken(response.data.token);
        setResetState("token");
      })
      .catch(() => {
        // Handle reset password for non existing user!
        toast.error("Email does not exist in our system. Please try again!");
      });
  };

  const handleTokenValidating = (e) => {
    e.preventDefault();
    if (formInfo.token === resetToken) {
      setResetState("new-password");
    } else {
      toast.error("Token is not valid! Try again!");
    }
  };

  const handleNewPassword = (e) => {
    e.preventDefault();
    if (
      validationMessage.passwordValidation === "valid" &&
      validationMessage.repeatPasswordValidation === "valid"
    ) {
      const data = {
        password: formInfo.password,
        email: formInfo.email,
      };
      axios
        .patch(`${address}/reset-password/`, data)
        .then((response) => {
          toast.success("Succesfully changed password!");
          setResetState(null);
          setFormInfo({
            email: "",
            token: "",
            password: "",
            repeatPassword: "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const style = {
    paperStyle: {
      padding: 20,
      margin: "0 auto",
      width: "30vw",
      minHeight: "auto",
    },
    buttonStyle: { margin: "7px 0px", fontWeight: 600 },
    textFieldStyle: { margin: "5px 0px" },
    titleStyle: { fontWeight: 600, fontSize: "3vh" },
  };

  // Validating token page!
  if (resetState === "token") {
    return (
      <div
        className="forgot-password-container"
        style={{ background: "#e9f4f7" }}
      >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
        />
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={logo} className="Vg-Logo" alt="logo" height="150" />

          <Paper style={style.paperStyle}>
            <form onSubmit={(e) => handleTokenValidating(e)}>
              <Grid align="center">
                <Typography style={style.titleStyle} gutterBottom>
                  Forgot Password
                </Typography>
                <TextField
                  type="text"
                  id="token"
                  name="token"
                  label="Token"
                  placeholder="Enter the token ..."
                  value={formInfo.token}
                  onChange={(e) => {
                    setFormInfo({ ...formInfo, token: e.target.value });
                  }}
                  style={style.textFieldStyle}
                  fullWidth
                  required
                />
                <Typography variant="subtitle1" gutterBottom component="div">
                  An email with the token to reset your password has been sent
                  to your email!
                </Typography>

                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={style.buttonStyle}
                  fullWidth
                  sx={{ backgroundColor: "#84CDCA" }}
                >
                  Validate Token
                </Button>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </div>
    );
  }

  // New password state!
  if (resetState === "new-password") {
    return (
      <div
        className="forgot-password-container"
        style={{ background: "#e9f4f7" }}
      >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
        />
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={logo} className="Vg-Logo" alt="logo" height="150" />

          <Paper style={style.paperStyle}>
            <form onSubmit={(e) => handleNewPassword(e)}>
              <Grid align="center">
                <Typography style={style.titleStyle} gutterBottom>
                  Forgot Password
                </Typography>
                {/* Password */}
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  label="Password *"
                  placeholder="Enter the new password ..."
                  value={formInfo.password}
                  onChange={(e) => {
                    setFormInfo({ ...formInfo, password: e.target.value });
                    const passwordVal = validatePassword(e.target.value);

                    // Current password requires
                    // - 8 min letters,
                    // - at least a symbol (...)
                    // - upper and lower case
                    // - a number

                    if (e.target.value.length === 0) {
                      setValidationMessage({
                        ...validationMessage,
                        passwordValidation: "empty",
                      });
                      return;
                    }

                    const updatedValidation = {};
                    if (!passwordVal) {
                      updatedValidation.passwordValidation = "invalid";
                    } else {
                      updatedValidation.passwordValidation = "valid";
                    }

                    if (e.target.value !== formInfo.repeatPassword) {
                      updatedValidation.repeatPasswordValidation = "invalid";
                    } else {
                      updatedValidation.repeatPasswordValidation = "valid";
                    }

                    setValidationMessage({
                      ...validationMessage,
                      passwordValidation: updatedValidation.passwordValidation,
                      repeatPasswordValidation:
                        updatedValidation.repeatPasswordValidation,
                    });
                  }}
                  style={style.textFieldStyle}
                  fullWidth
                  required
                />
                {/* Repeat Password */}
                <TextField
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  label="Confirm Password *"
                  placeholder="Re-enter the password ..."
                  value={formInfo.repeatPassword}
                  onChange={(e) => {
                    setFormInfo({
                      ...formInfo,
                      repeatPassword: e.target.value,
                    });

                    if (e.target.value.length === 0) {
                      setValidationMessage({
                        ...validationMessage,
                        repeatPasswordValidation: "empty",
                      });
                      return;
                    }

                    if (e.target.value !== formInfo.password) {
                      setValidationMessage({
                        ...validationMessage,
                        repeatPasswordValidation: "invalid",
                      });
                    } else {
                      setValidationMessage({
                        ...validationMessage,
                        repeatPasswordValidation: "valid",
                      });
                    }
                  }}
                  style={style.textFieldStyle}
                  fullWidth
                  required
                />

                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={style.buttonStyle}
                  fullWidth
                  sx={{ backgroundColor: "#84CDCA" }}
                >
                  Request password reset
                </Button>
              </Grid>
            </form>
            <ValidationLogs validationMessage={validationMessage} />
          </Paper>
        </Grid>
      </div>
    );
  }

  // Enter email page!
  return (
    <div
      className="forgot-password-container"
      style={{ background: "#e9f4f7" }}
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <img src={logo} className="Vg-Logo" alt="logo" height="150" />

        <Paper style={style.paperStyle}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Grid align="center">
              <Typography style={style.titleStyle} gutterBottom>
                Forgot Password
              </Typography>
              <TextField
                type="text"
                id="email"
                name="email"
                label="Email"
                placeholder="Enter an email ..."
                value={formInfo.email}
                onChange={(e) => {
                  setFormInfo({ ...formInfo, email: e.target.value });
                }}
                style={style.textFieldStyle}
                fullWidth
                required
              />

              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={style.buttonStyle}
                fullWidth
                sx={{ backgroundColor: "#84CDCA" }}
              >
                Request password reset
              </Button>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};

export default ForgotPassword;
