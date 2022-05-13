// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";

// Files
import "./CompareProgress.css";
import { gameTypeRendering } from "../../../utils/gameType";
import ToolTip from "../../Template/ToolTip";

// Material UI
import { Box, Typography, Paper, Grid, Select, Divider } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

// CompareProgress: A component that displays the page for compare progress
const CompareProgress = ({ session, sessionList, versions }) => {
  // Sets the default search when the component first renders by checking each version and date
  let endDate = Date.parse(session.endTime);
  const [version, setVersion] = useState("");
  let searchedList = sessionList.filter(
    (session) => Date.parse(session.endTime) < endDate
  );
  const [currentList, setCurrentList] = useState(searchedList);
  let currentDate = new Date(session.endTime);

  // Get all the current session's statistics
  const currentSessionHitsAndMisses = Math.floor(
    (session.hits / (session.hits + session.misses)) * 100
  );
  const currentLeftArmAvgSpeed = parseFloat(session.leftArmAvgSpeed.toFixed(2));
  const currentRightArmAvgSpeed = parseFloat(
    session.rightArmAvgSpeed.toFixed(2)
  );
  const currentHeadAvgSpeed = parseFloat(session.headAvgSpeed.toFixed(2));
  const currentAvgTargetTime = parseFloat(session.avgHitSpeed.toFixed(2));

  // Get all previous session statistics
  // By previous, the sessions that were played before the current sessions
  let prevSessionsHitsAndMisses = 0;
  let prevSessionsLeftArmAvgSpeed = 0;
  let prevSessionsRightArmAvgSpeed = 0;
  let prevSessionsHeadAvgSpeed = 0;
  let prevSessionsAvgTargetTime = 0;

  let isCurrentListNotEmpty = currentList.length > 0;

  for (let i = 0; i < currentList.length; i++) {
    prevSessionsHitsAndMisses += Math.floor(
      (currentList[i].hits / (currentList[i].hits + currentList[i].misses)) *
        100
    );
    prevSessionsLeftArmAvgSpeed += parseFloat(
      currentList[i].leftArmAvgSpeed.toFixed(2)
    );
    prevSessionsRightArmAvgSpeed += parseFloat(
      currentList[i].rightArmAvgSpeed.toFixed(2)
    );
    prevSessionsHeadAvgSpeed += parseFloat(
      currentList[i].headAvgSpeed.toFixed(2)
    );
    prevSessionsAvgTargetTime += parseFloat(
      currentList[i].avgHitSpeed.toFixed(2)
    );
  }
  prevSessionsHitsAndMisses = Math.floor(
    (prevSessionsHitsAndMisses / currentList.length).toFixed(2)
  );
  prevSessionsLeftArmAvgSpeed = parseFloat(
    (prevSessionsLeftArmAvgSpeed / currentList.length).toFixed(2)
  );
  prevSessionsRightArmAvgSpeed = parseFloat(
    (prevSessionsRightArmAvgSpeed / currentList.length).toFixed(2)
  );
  prevSessionsHeadAvgSpeed = parseFloat(
    (prevSessionsHeadAvgSpeed / currentList.length).toFixed(2)
  );
  prevSessionsAvgTargetTime = parseFloat(
    (prevSessionsAvgTargetTime / currentList.length).toFixed(2)
  );

  // display stats color is an array of functions that display color of a statistic
  // depending on if the currentSession's stat is higher than prevSession's stat
  const displayIndicator = (current, previous, targetTime = false) => {
    let difference = Math.abs(current - previous).toFixed(2);
    let percentage = parseInt((difference / previous) * 100);
    if (targetTime) {
      return displayTargetTime(current, previous, difference);
    }
    if (current > previous) {
      return (
        <Box sx={{ color: "#50C878", height: 20 }}>
          <AiOutlineArrowUp />
          {percentage}% above average
        </Box>
      );
    } else if (current < previous) {
      return (
        <Box sx={{ color: "red", height: 20 }}>
          <AiOutlineArrowDown />
          {percentage}% below average
        </Box>
      );
    } else {
      return <Box sx={{ height: 20 }} />;
    }
  };

  // Displays the indicator specific to Target Time
  const displayTargetTime = (current, previous, difference) => {
    if (current < previous) {
      return (
        <Box sx={{ color: "#50C878", height: 20 }}>
          <AiOutlineArrowUp />
          {difference} seconds faster
        </Box>
      );
    } else if (current > previous) {
      return (
        <Box sx={{ color: "red", height: 20 }}>
          <AiOutlineArrowDown />
          {difference} seconds slower
        </Box>
      );
    } else {
      return <Box sx={{ height: 20 }} />;
    }
  };

  // Defines the searching of the versions
  const handleChange = (e) => {
    let versionNumber = e.target.value;
    setVersion(versionNumber);
    searchedList = sessionList.filter(
      (session) =>
        Date.parse(session.endTime) < endDate &&
        session.version.includes(versionNumber)
    );
    setCurrentList(searchedList);
  };

  // Shows the drop down menu of versions available to search for
  const displayVersions = () => {
    if (versions) {
      return versions.map((item) => (
        <MenuItem value={item} key="version">
          {item}
        </MenuItem>
      ));
    }
  };

  // The themed style for the each box containing a metric
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  // Renders the components
  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#84CDCA",
          p: 4,
        }}
      >
        <div className="averages-container">
          {/*Current Session*/}
          <div className="current-session-container">
            <Item
              sx={{
                height: "40vh",
                minHeight: "450px",
                maxHeight: "500px",
                minWidth: "650px",
              }}
            >
              {/* Title, game name, version */}
              <Grid container>
                <Grid item>
                  <Typography variant="h5">Current Session</Typography>
                </Grid>
                <Grid item>
                  <ToolTip description="Shows the metric statistics for the current game session" />
                </Grid>
              </Grid>
              <Box display="flex" flexDirection="column">
                <div>
                  <Typography variant="button">Game: </Typography>
                  {gameTypeRendering(session.gameType)}
                </div>
                <div>
                  <Typography variant="button">Version: </Typography>
                  {session.version}
                </div>
                <div>
                  <Typography variant="button">Date: </Typography>
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </Box>

              {/* Metrics */}
              {/* Target Time and Hit Miss Metric */}
              <Grid className="target-time-hit-miss" container>
                <Grid item xs align="center" sx={{ px: 3, py: 3 }}>
                  <Typography variant="button" fontSize={20}>
                    AVERAGE TARGET TIME
                  </Typography>
                  <Typography variant="h5">
                    {currentAvgTargetTime} seconds
                  </Typography>
                  {displayIndicator(
                    currentAvgTargetTime,
                    prevSessionsAvgTargetTime,
                    true
                  )}
                </Grid>
                <Divider variant="middle" orientation="vertical" flexItem />
                <Grid item xs align="center" sx={{ px: 3, py: 3 }}>
                  <Typography variant="button" fontSize={20}>
                    HITS AND MISSES
                  </Typography>
                  <Typography variant="h5">
                    {currentSessionHitsAndMisses}%
                  </Typography>
                  {displayIndicator(
                    currentSessionHitsAndMisses,
                    prevSessionsHitsAndMisses
                  )}
                </Grid>
              </Grid>

              {/* Joint Speeds */}
              <Box
                className="join-speeds"
                display="flex"
                flexDirection="column"
                justify="center"
                alignItems="center"
                minHeight="100px"
                sx={{ py: 3 }}
              >
                <Typography variant="button" fontSize={20}>
                  AVERAGE JOINT SPEEDS
                </Typography>
                <Grid container>
                  <Grid item xs align="center" sx={{ px: 3 }}>
                    <Typography variant="overline">LEFT ARM</Typography>
                    <Typography variant="h5">
                      {currentLeftArmAvgSpeed} cm/s
                    </Typography>
                    {displayIndicator(
                      currentLeftArmAvgSpeed,
                      prevSessionsLeftArmAvgSpeed
                    )}
                  </Grid>
                  <Divider variant="middle" orientation="vertical" flexItem />
                  <Grid item xs align="center" sx={{ px: 3 }}>
                    <Typography variant="overline">HEAD</Typography>
                    <Typography variant="h5">
                      {currentHeadAvgSpeed} cm/s
                    </Typography>
                    {displayIndicator(
                      currentHeadAvgSpeed,
                      prevSessionsHeadAvgSpeed
                    )}
                  </Grid>
                  <Divider variant="middle" orientation="vertical" flexItem />
                  <Grid item xs align="center" sx={{ px: 3 }}>
                    <Typography variant="overline">RIGHT ARM</Typography>
                    <Typography variant="h5">
                      {currentRightArmAvgSpeed} cm/s
                    </Typography>
                    {displayIndicator(
                      currentRightArmAvgSpeed,
                      prevSessionsRightArmAvgSpeed
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Item>
          </div>

          {/*Previous Sessions*/}
          <div className="previous-session-container">
            <Item
              sx={{
                height: "40vh",
                minHeight: "450px",
                maxHeight: "500px",
                minWidth: "650px",
              }}
            >
              {/* Title, game name, version */}
              <Grid container>
                <Grid item>
                  <Typography variant="h5">Previous Sessions</Typography>
                </Grid>
                <Grid item>
                  <ToolTip description="Shows the averages of all previous sessions from the current session date. Selecting a specific version will recalculate the average of all previous sessions for the selected version" />
                </Grid>
              </Grid>

              <Box display="flex" flexDirection="column" sx={{ pb: 1 }}>
                <div>
                  <Typography variant="button">Game: </Typography>
                  {gameTypeRendering(session.gameType)}
                </div>
                <div sx={{ align: "center" }}>
                  <Typography variant="button">VERSION: </Typography>
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Search Version
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Version"
                      value={version}
                      onChange={handleChange}
                    >
                      <MenuItem value="">All Versions</MenuItem>
                      {displayVersions()}
                    </Select>
                  </FormControl>
                </div>
              </Box>
              {isCurrentListNotEmpty ? (
                <div>
                  {/* Metrics */}
                  {/* Target Time and Hit Miss Metric */}
                  <Grid container>
                    <Grid item xs align="center" sx={{ px: 3, py: 3 }}>
                      <Typography variant="button" fontSize={20}>
                        AVERAGE TARGET TIME
                      </Typography>
                      <Typography variant="h5">
                        {prevSessionsAvgTargetTime} seconds
                      </Typography>
                    </Grid>
                    <Divider variant="middle" orientation="vertical" flexItem />
                    <Grid item xs align="center" sx={{ px: 3, py: 3 }}>
                      <Typography variant="button" fontSize={20}>
                        HITS AND MISSES
                      </Typography>
                      <Typography variant="h5">
                        {prevSessionsHitsAndMisses}%
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Joint Speeds */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    justify="center"
                    alignItems="center"
                    minHeight="100px"
                    sx={{ py: 3 }}
                  >
                    <Typography variant="button" fontSize={20}>
                      AVERAGE JOINT SPEEDS
                    </Typography>
                    <Grid container>
                      <Grid item xs align="center" sx={{ px: 3 }}>
                        <Typography variant="overline">LEFT ARM</Typography>
                        <Typography variant="h5">
                          {prevSessionsLeftArmAvgSpeed} cm/s
                        </Typography>
                      </Grid>
                      <Divider
                        variant="middle"
                        orientation="vertical"
                        flexItem
                      />
                      <Grid item xs align="center" sx={{ px: 3 }}>
                        <Typography variant="overline">HEAD</Typography>
                        <Typography variant="h5">
                          {prevSessionsHeadAvgSpeed} cm/s
                        </Typography>
                      </Grid>
                      <Divider
                        variant="middle"
                        orientation="vertical"
                        flexItem
                      />
                      <Grid item xs align="center" sx={{ px: 3 }}>
                        <Typography variant="overline">RIGHT ARM</Typography>
                        <Typography variant="h5">
                          {prevSessionsRightArmAvgSpeed} cm/s
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              ) : (
                <Typography>There are no previous sessions</Typography>
              )}
            </Item>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default CompareProgress;

// Checks the properties are of the correct type
CompareProgress.propTypes = {
  session: PropTypes.object,
  sessionList: PropTypes.array,
  versions: PropTypes.array,
};
