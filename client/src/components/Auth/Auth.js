// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component imports
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

// Material UI
import { AppBar, Tab, Tabs } from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#83c2bc" },
    secondary: { main: "#ffdc9f" },
  },
});

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    backgroundColor: "#fff",
  },
});

// Custom Style Tab
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: "medium",
    fontSize: "medium",
    marginRight: theme.spacing(1),
    color: "#faf9f6",
    "&.Mui-selected": {
      color: "#c2c080",
    },
  })
);

// Auth: A container of Login and SignUp. This is displayed as tabs
// that can be switched between login and signup.
const Auth = (props) => {
  const [value, setValue] = useState(0);
  const { setToken } = props;

  // handle tab switching events
  const handleTabs = (event, val) => {
    setValue(val);
  };

  // render
  return (
    <ThemeProvider theme={theme}>
      <div className="session-details-container">
        <AppBar position="static" style={{ background: "#2c8579" }}>
          <StyledTabs value={value} onChange={handleTabs} centered>
            <StyledTab label="LOGIN" />
            <StyledTab label="SIGN UP" />
            <StyledTab label="FORGOT PASSWORD" />
          </StyledTabs>
          <TabPanel value={value} index={0}>
            <Login setToken={setToken} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SignUp />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ForgotPassword />
          </TabPanel>
        </AppBar>
      </div>
    </ThemeProvider>
  );
};

export default Auth;

Auth.propTypes = {
  setToken: PropTypes.func.isRequired,
};

const TabPanel = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children, value, index } = props;
  return <div>{value === index && <div>{children}</div>}</div>;
};
