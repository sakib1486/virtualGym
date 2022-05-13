/* eslint-disable no-unused-vars */
// Dependencies
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

// Files
import "./UserProfile.css";
import { getLocalToken } from "../../utils/localStorage";
import { extractJwts } from "../../utils/extractJwts";
import ValidationLogs from "../Auth/ValidationLogs";
import { clientId, address } from "../../utils/config";

// Material UI
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

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

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [profileState, setProfileState] = useState();
  const [formInfo, setFormInfo] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [validationMessage, setValidationMessage] = useState({
    passwordValidation: "",
    repeatPasswordValidation: "",
  });

  useEffect(() => {
    const jwt = getLocalToken();
    const payloads = extractJwts(jwt);
    setUserInfo(payloads);
    setFormInfo({ ...formInfo, email: payloads.email });
  }, []);

  const handleChangePassword = () => {
    setProfileState("change-password");
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
          setProfileState(null);
          setFormInfo({
            email: "",
            password: "",
            repeatPassword: "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  if (profileState === "change-password") {
    return (
      <div
        className="forgot-password-container"
        style={{ background: "#e9f4f7" }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Paper style={style.paperStyle}>
            <form onSubmit={(e) => handleNewPassword(e)}>
              {" "}
              <Grid align="center">
                <Typography style={style.titleStyle} gutterBottom>
                  Change Password
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
                  Request change password
                </Button>
              </Grid>
            </form>
            <ValidationLogs validationMessage={validationMessage} />
          </Paper>
        </Grid>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
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
      <Container maxWidth="xl">
        <div className="user-profile-content">
          {/* Table */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "black", marginTop: "20px" }}
          >
            User Profile
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: "40vw", minWidth: "500px" }}
          >
            <Table sx={{ minHeight: 380 }} aria-label="simple table">
              <colgroup>
                <col style={{ width: "30%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <TableBody>
                <TableRow>
                  <TableCell align="right">
                    <b>Username</b>
                  </TableCell>
                  <TableCell>{userInfo.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">
                    <b>First Name</b>
                  </TableCell>
                  <TableCell>{userInfo.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">
                    <b>Last Name</b>
                  </TableCell>
                  <TableCell>{userInfo.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">
                    <b>Email</b>
                  </TableCell>
                  <TableCell>{userInfo.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">
                    <b>Password</b>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      style={style.buttonStyle}
                      sx={{ backgroundColor: "#84CDCA" }}
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </div>
  );
};

export default UserProfile;
