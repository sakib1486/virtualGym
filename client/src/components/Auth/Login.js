// Dependencies
import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Files
import "./Login.css";
import { setLocalToken } from "../../utils/localStorage";
import { clientId, address } from "../../utils/config";
import logo from "../../images/vg-logo.png";

// Material UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { FcGoogle } from "react-icons/fc";

// ---------- User Story 2.0.1 - Login (Must Have)

// Login component that currently allows google Login.
// This component is a tab in Auth

const Login = (props) => {
  const { setToken } = props;
  const [formInfo, setFormInfo] = useState({ email: "", password: "" });

  // Styles
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

  // Handling succesful response from Google API
  const successfulResponseGoogle = (response) => {
    const data = {
      id_token: response.tokenId,
      email: response.profileObj.email,
      familyName: response.profileObj.familyName,
      givenName: response.profileObj.givenName,
    };

    // POST request to our API to validate and login
    axios
      .post(`${address}/login/google/`, data)
      .then((response) => {
        if (response.data.message === "user not approved") {
          toast.error(
            "Account is not approved by an admin yet! Please wait until your account is approved!"
          );
          return;
        }
        // Set token for current login session
        setToken(response.data.token);
        setLocalToken(response.data.token);
      })
      .catch(() => {
        toast.error("User does not exist in our system! Please try again!");
      });
  };

  const failedResponseGoogle = (response) => {
    console.log(response);
  };

  // Handle Standard Login
  const handleStandardLogin = (e) => {
    // This functions handle standard login (requires password and email)
    e.preventDefault();
    const data = {
      email: formInfo.email,
      password: formInfo.password,
    };
    axios
      .post(`${address}/login/standard/`, data)
      .then((response) => {
        if (response.data.message === "user not approved") {
          toast.error(
            "Account is not approved by an admin yet! Please wait until your account is approved!"
          );
          return;
        }
        setToken(response.data.token);
        setLocalToken(response.data.token);
      })
      .catch(() => {
        toast.error("Wrong Credentials! Please try again!");
      });
  };

  // Render the Login Form
  return (
    <div className="login-container" style={{ background: "#e9f4f7" }}>
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
          <form onSubmit={(e) => handleStandardLogin(e)}>
            <Grid align="center">
              <Typography style={style.titleStyle} gutterBottom>
                Welcome to Virtual Gym Dashboard
              </Typography>
              <TextField
                type="text"
                id="email"
                name="email"
                label="Email"
                placeholder="Enter an email ..."
                value={formInfo.email}
                autoComplete="off"
                onChange={(e) => {
                  setFormInfo({ ...formInfo, email: e.target.value });
                }}
                style={style.textFieldStyle}
                fullWidth
                required
              />
              <TextField
                type="password"
                id="password"
                name="password"
                label="Password"
                placeholder="Enter a password ..."
                value={formInfo.password}
                autoComplete="new-password"
                onChange={(e) => {
                  setFormInfo({ ...formInfo, password: e.target.value });
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
                Log In
              </Button>
              <GoogleLogin
                clientId={clientId}
                buttonText="Log in with Google"
                onSuccess={successfulResponseGoogle}
                onFailure={failedResponseGoogle}
                cookiePolicy={"single_host_origin"}
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
                    Log In With Google
                  </Button>
                )}
              />
            </Grid>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func,
};

export default Login;
