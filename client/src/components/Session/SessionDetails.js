// Dependencies
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// Component imports
import GamePerformance from "./GamePerformancePage/GamePerformance";
import FunctionalMobility from "./FunctionalMobilityPage/FunctionalMobility";
import CompareProgress from "./CompareProgressPage/CompareProgress";

// Material UI
import { AppBar, Tab, Tabs } from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Container from "@mui/material/Container";

const theme = createTheme({
  palette: {
    primary: { main: "#83c2bc" },
    secondary: { main: "#ffdc9f" },
  },
});

// Custom Style Tabs
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

// SessionDetails: A component that displays the page for session details
// This component renders a tab that displays the pages for GamePerformance, FuncitonalMobility and CompareProgress component pages
const SessionDetails = () => {
  const { state } = useLocation();
  const sessionList = state.sessionList;
  const versions = state.versions;
  const [value, setValue] = useState(0);

  const handleTabs = (event, val) => {
    setValue(val);
  };

  // Renders GamePerformance, FuncitonalMobility and CompareProgress component pages
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ marginTop: "20px" }}>
        <AppBar
          position="static"
          style={{
            background: "#2c8579",
          }}
        >
          <StyledTabs value={value} onChange={handleTabs} centered>
            <StyledTab label="GAME PERFORMANCE" />
            <StyledTab label="FUNCTIONAL MOBILITY" />
            <StyledTab label="COMPARE PROGRESS" />
          </StyledTabs>
          <TabPanel value={value} index={0}>
            <GamePerformance session={state.session} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <FunctionalMobility session={state.session} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <CompareProgress session={state.session} sessionList={sessionList} versions={versions}/>
          </TabPanel>
        </AppBar>
      </Container>
    </ThemeProvider>
  );
};

export default SessionDetails;

const TabPanel = (props) => {
  const { children, value, index } = props;
  return <div>{value === index && <div>{children}</div>}</div>;
};

TabPanel.propTypes = {
  children: PropTypes.object,
  value: PropTypes.number,
  index: PropTypes.number,
};
