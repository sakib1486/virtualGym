// Dependencies
import React from "react";
import "./SignUp.css";
import { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// Files
import { clientId, address } from "../../utils/config";
import ValidationLogs from "./ValidationLogs";
import logo from "../../images/vg-logo.png";
import { FcGoogle } from "react-icons/fc";

// Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// ---------- User Story 2.0.2 - Sign Up (Must Have)
// Sign Up component that currently allows google SignUp.
// This component is a tab in Auth

const SignUp = () => {
  const [formInfo, setFormInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    repeatPassword: "",
    username: "",
  });

  const [open, setOpen] = useState(false);

  // msg: message content
  // type: error, warning, info, success
  const [validationMessage, setValidationMessage] = useState({
    emailValidation: "",
    firstNameValidation: "",
    lastNameValidation: "",
    passwordValidation: "",
    repeatPasswordValidation: "",
  });

  const [googleData, setGoogleData] = useState({
    id_token: "",
    email: "",
    familyName: "",
    givenName: "",
  });

  // Styles
  const style = {
    paperStyle: {
      padding: 20,
      margin: "0 auto",
      width: "30vw",
      height: "auto",
    },
    buttonStyle: { margin: "7px 0px", fontWeight: 600 },
    textFieldStyle: { margin: "7px 0px" },
    titleStyle: { fontWeight: 600, fontSize: "3vh" },
  };

  // handling succesfuly response for google api
  const successfulResponseGoogle = (response) => {
    setGoogleData({
      id_token: response.tokenId,
      email: response.profileObj.email,
      familyName: response.profileObj.familyName,
      givenName: response.profileObj.givenName,
    });
    setOpen(true);
  };

  const handleSubmitUsername = () => {
    axios
      .post(`${address}/signup/google/`, googleData)
      .then((response) => {
        if (response.status === 201) {
          toast.success("Sign Up Successful");
        } else if (response.status === 200) {
          toast.error(
            "This Google account is already registered in the system"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data);
      });
    setOpen(false);
  };

  const failedresponseGoogle = (response) => {
    console.log(response);
  };

  // Handle Standard Sign Up
  const handleStandardSignup = (e) => {
    // Email has to follow the correct format
    // Password has to follow the requirements
    // Password has to match with "Re-enter password"

    e.preventDefault();
    if (
      validationMessage.emailValidation === "valid" &&
      validationMessage.firstNameValidation === "valid" &&
      validationMessage.lastNameValidation === "valid" &&
      validationMessage.passwordValidation === "valid" &&
      validationMessage.repeatPasswordValidation === "valid"
    ) {
      const data = {
        email: formInfo.email,
        firstName: formInfo.firstName,
        lastName: formInfo.lastName,
        password: formInfo.password,
        username: formInfo.username,
      };
      axios.post(`${address}/signup/standard/`, data).then((response) => {
        console.log(response);
        if (response.status === 201) {
          toast.success("Sign Up Successful");
          setValidationMessage({
            ...validationMessage,
            emailValidation: "",
            firstNameValidation: "",
            lastNameValidation: "",
            passwordValidation: "",
            repeatPasswordValidation: "",
          });
          setFormInfo({
            ...formInfo,
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            repeatPassword: "",
            username: "",
          });
        } else if (response.status === 200) {
          toast.error(
            "This account (email) is already registered in the system"
          );
        }
      });
    } else {
      toast.error("Your inputs are not valid. Please try again!");
      return;
    }
  };

  // Validate Email Input using Regex
  const validateEmail = (email) => {
    // Regex to check for email matches
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (email.match(pattern)) {
      return true;
    }
    return false;
  };

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

  // Render the SignUp Form
  return (
    <div className="signup-container" style={{ background: "#e9f4f7" }}>
      {/* Toast Message */}
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
        <img src={logo} className="Vg-Logo" alt="logo" height="100" />

        <Paper style={style.paperStyle}>
          <form onSubmit={(e) => handleStandardSignup(e)}>
            <Grid align="center">
              <Typography style={style.titleStyle}>Sign up</Typography>
            </Grid>
            {/* Email */}
            <TextField
              type="text"
              id="email"
              name="email"
              label="Email *"
              placeholder="Enter an email ..."
              value={formInfo.email}
              onChange={(e) => {
                setFormInfo({ ...formInfo, email: e.target.value });
                const emailVal = validateEmail(e.target.value);
                if (e.target.value.length === 0) {
                  setValidationMessage({
                    ...validationMessage,
                    emailValidation: "empty",
                  });
                  return;
                }
                if (!emailVal) {
                  setValidationMessage({
                    ...validationMessage,
                    emailValidation: "invalid",
                  });
                } else {
                  setValidationMessage({
                    ...validationMessage,
                    emailValidation: "valid",
                  });
                }
              }}
              style={style.textFieldStyle}
              fullWidth
            />
            {/* First Name */}
            <TextField
              type="text"
              id="firstName"
              name="firstName"
              label="First Name *"
              placeholder="Enter your first name ..."
              value={formInfo.firstName}
              onChange={(e) => {
                setFormInfo({ ...formInfo, firstName: e.target.value });
                if (e.target.value.length === 0) {
                  setValidationMessage({
                    ...validationMessage,
                    firstNameValidation: "empty",
                  });
                  return;
                }

                setValidationMessage({
                  ...validationMessage,
                  firstNameValidation: "valid",
                });
              }}
              style={style.textFieldStyle}
              fullWidth
            />
            {/* Last Name */}
            <TextField
              type="text"
              id="lastName"
              name="lastName"
              label="Last Name *"
              placeholder="Enter your last name ..."
              value={formInfo.lastName}
              onChange={(e) => {
                setFormInfo({ ...formInfo, lastName: e.target.value });
                if (e.target.value.length === 0) {
                  setValidationMessage({
                    ...validationMessage,
                    lastNameValidation: "empty",
                  });
                  return;
                }

                setValidationMessage({
                  ...validationMessage,
                  lastNameValidation: "valid",
                });
              }}
              style={style.textFieldStyle}
              fullWidth
            />
            {/* Username */}
            <TextField
              type="text"
              id="userName"
              name="userName"
              label="Username *"
              placeholder="Enter your username ..."
              value={formInfo.username}
              autoComplete="off"
              onChange={(e) => {
                setFormInfo({ ...formInfo, username: e.target.value });
              }}
              style={style.textFieldStyle}
              fullWidth
            />
            {/* Password */}
            <TextField
              type="password"
              id="password"
              name="password"
              label="Password *"
              placeholder="Enter the password ..."
              value={formInfo.password}
              autoComplete="new-password"
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
                setFormInfo({ ...formInfo, repeatPassword: e.target.value });

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
            />
            {/* Sign Up Button */}
            <Button
              type="submit"
              style={style.buttonStyle}
              color="primary"
              variant="contained"
              onSubmit={(e) => handleStandardSignup(e)}
              fullWidth
              sx={{ backgroundColor: "#84CDCA" }}
            >
              Sign Up
            </Button>
          </form>
          {/* Google Sign Up Button */}
          <GoogleLogin
            clientId={clientId}
            buttonText="Log in with Google"
            onSuccess={successfulResponseGoogle}
            onFailure={failedresponseGoogle}
            cookiePolicy={"single_host_origin"}
            // This is a custom button
            render={(renderProps) => (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={style.buttonStyle}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                fullWidth
                sx={{ backgroundColor: "#84CDCA" }}
              >
                <FcGoogle />
                Sign Up With Google
              </Button>
            )}
          />
          {
            <Popup
              open={open}
              style={{ ".popup-content": "100px" }}
              closeOnDocumentClick={false}
            >
              <Grid container alignItems="center" direction="column">
                <div>
                  Enter a username that will be associated with your google
                  account.
                </div>
                <form>
                  <TextField
                    label="Username *"
                    fullWidth
                    style={style.textFieldStyle}
                    onChange={(e) => {
                      setGoogleData({
                        ...googleData,
                        username: e.target.value,
                      });
                    }}
                  ></TextField>
                </form>
                <div>
                  <Button
                    style={{ width: "200px", margin: "10px" }}
                    type="button"
                    variant="contained"
                    onClick={() => setOpen(false)}
                    sx={{ backgroundColor: "#84CDCA" }}
                  >
                    cancel
                  </Button>
                  <Button
                    style={{ width: "200px" }}
                    type="button"
                    variant="contained"
                    onClick={handleSubmitUsername}
                    sx={{ backgroundColor: "#84CDCA" }}
                  >
                    Click to submit
                  </Button>
                </div>
              </Grid>
            </Popup>
          }
          <ValidationLogs validationMessage={validationMessage} />
        </Paper>
      </Grid>
    </div>
  );
};

export default SignUp;
