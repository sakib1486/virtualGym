// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Files
import { gameTypeRendering } from "../../../utils/gameType";
import { formatDate } from "../../../utils/dateFormat";

// Components
import ToolTip from "../../Template/ToolTip";

// Material UI
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import { Typography } from "@mui/material";

// Helper function to convert milliseconds into a more human readable format HH:MM:SS
const timeConverter = (milliseconds) => {
  let exactHours = milliseconds / (1000 * 3600);
  let hours = Math.floor(exactHours);
  let exactMinutes = 60 * (exactHours - hours);
  let minutes = Math.floor(exactMinutes);
  var seconds = Math.floor(60 * (exactMinutes - minutes));
  return (
    (hours > 9 ? hours : "0" + hours) +
    ":" +
    (minutes > 9 ? minutes : "0" + minutes) +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds)
  );
};

// PerformanceTable: A component that displays a table describing the selected session that includes
// game name, version, player name, start and end time and the total time played
const PerformanceTable = ({ session }) => {
  // Get the session start and end time
  let startTime = new Date(session.startTime);
  let endTime = new Date(session.endTime);
  let milliseconds = endTime.getTime() - startTime.getTime();

  // Renders the performance table
  return (
    <div className="performance-table-container">
      <div className="table-header">
        <Grid container>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Performance Table
            </Typography>
          </Grid>
          <Grid item>
            <ToolTip description="Shows the selected game session's information" />
          </Grid>
        </Grid>
      </div>
      <div className="performance-table">
        <TableContainer sx={{ maxWidth: "40vw" }}>
          <Table
            sx={{ minWidth: 400, minHeight: 330 }}
            aria-label="simple table"
          >
            <TableBody>
              <TableRow>
                <TableCell align="right">
                  <b>GAME</b>
                </TableCell>
                <TableCell align="left">
                  {gameTypeRendering(session.gameType)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <b>VERSION</b>
                </TableCell>
                <TableCell align="left">{session.version}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <b>PLAYER NAME</b>
                </TableCell>
                <TableCell align="left">
                  {session.userFirstName} {session.userLastName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <b>USERNAME</b>
                </TableCell>
                <TableCell align="left">{session.user}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <b>START TIME</b>
                </TableCell>
                <TableCell align="left">{formatDate(startTime)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <b>END TIME</b>
                </TableCell>
                <TableCell align="left">{formatDate(endTime)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  <b>TOTAL TIME PLAYED</b>
                </TableCell>
                <TableCell align="left">
                  {timeConverter(milliseconds)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

PerformanceTable.propTypes = {
  session: PropTypes.object,
};
export default PerformanceTable;
