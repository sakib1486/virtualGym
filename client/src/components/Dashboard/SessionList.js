// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";

// Components
import SearchBar from "./SearchBar";
import SessionItem from "./SessionItem";
import NotFoundScreen from "./NotFoundScreen";
import {
  CustomPagination,
  CustomPaginateRows,
} from "../Template/CustomPagination";

// Material UI
import List from "@mui/material/List";
import Box from "@mui/material/Box";

// SessionList: a component that renders the list of sessions
// The list of sessions are passed to this component as props from the Dashboard component
const SessionList = (props) => {
  const { sessionList, versions } = props;
  const [currentList, setCurrentList] = useState(sessionList);

  // Init Custom Pagination
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 5;
  const itemName = "Session";
  const calculatedRows = CustomPaginateRows(
    currentList,
    activePage,
    rowsPerPage
  );
  const count = currentList.length;
  const totalPages = Math.ceil(count / rowsPerPage);

  const [game, setGame] = useState("");
  const [player, setPlayer] = useState("");
  const [date, setDate] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [version, setVersion] = useState("");

  // Renders the session list when the searchbar is in use
  const onType = (e) => {
    let gameName = game;
    let playerName = player;
    let dateRange = date;
    let startDate = startTime;
    let endDate = endTime;
    let versionNumber = version;

    let e_num, e_msg;

    // Split the data, e.g. "1:information"
    let ind_colon = e.indexOf(":");
    if (ind_colon === -1) {
      e_num = -1;
    } else {
      e_num = e.substring(0, ind_colon);
      e_msg = e.substring(ind_colon + 1);
    }

    // Clear filter
    if (e_num === -1) {
      gameName = "";
      playerName = "";
      dateRange = false;
      versionNumber = "";
      setGame("");
      setPlayer("");
      setDate(false);
      setVersion("");
    }
    // Search for Game
    else if (e_num === "1") {
      setGame(e_msg);
      gameName = e_msg;
    }
    // Search for Player
    else if (e_num === "2") {
      setPlayer(e_msg);
      playerName = e_msg;
    }
    // Search for Date Range
    else if (e_num === "3") {
      ind_colon = e_msg.indexOf("/");
      if (ind_colon > 8) {
        const e_dates = e_msg.split("/");
        startDate = Date.parse(e_dates[0]);
        endDate = Date.parse(e_dates[1]) + 86400000;
        dateRange = true;
        setDate(true);
        setStartTime(startDate);
        setEndTime(endDate);
      }
    }
    // Search for Version
    else if (e_num === "4") {
      setVersion(e_msg);
      versionNumber = e_msg;
    }

    if (dateRange === true) {
      const searchedList = sessionList.filter(
        (session) =>
          // If searchbar isn't empty and daterangepick, search through gametype, first name, and last name
          session.gameType.toLowerCase().includes(gameName) &&
          (session.userFirstName.toLowerCase().includes(playerName) ||
            session.userLastName.toLowerCase().includes(playerName)) &&
          Date.parse(session.startTime) > startDate &&
          Date.parse(session.endTime) < endDate &&
          session.version.includes(versionNumber)
      );
      setCurrentList(searchedList);
    } else {
      const searchedList = sessionList.filter(
        (session) =>
          // If searchbar isn't empty, search through gametype, first name, and last name
          session.gameType.toLowerCase().includes(gameName) &&
          (session.userFirstName.toLowerCase().includes(playerName) ||
            session.userLastName.toLowerCase().includes(playerName)) &&
          session.version.includes(versionNumber)
      );
      setCurrentList(searchedList);
    }
  };

  // Renders the SearchBar and SessionItem component
  return (
    <div className="session-list-container">
      <div
        className="session-list"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div>
          <Box
            sx={{
              border: 1,
              borderColor: "lightgrey",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 400,
              mb: 2,
              mr: 2,
              pt: 3,
              pb: 3,
              backgroundColor: "white",
            }}
          >
            <SearchBar searchChangeHandling={onType} versions={versions} />

            {
              // Custom Pagination and check the row is empty or not
              calculatedRows.length === 0 ? (
                // Row is empty
                <CustomPagination
                  activePage={1}
                  count={0}
                  rowsPerPage={rowsPerPage}
                  totalPages={1}
                  setActivePage={setActivePage}
                  itemName={itemName}
                />
              ) : (
                // Row is not empty
                <CustomPagination
                  activePage={activePage}
                  count={count}
                  rowsPerPage={rowsPerPage}
                  totalPages={totalPages}
                  setActivePage={setActivePage}
                  itemName={itemName}
                />
              )
            }
          </Box>
        </div>

        { // Check the row is empty or not
          calculatedRows.length === 0 ? (
            // Row is empty
            <NotFoundScreen />
          ) : (
            // Row is not empty
            <div className="session-list" style={{ flexGrow: 6 }}>
              <List
                disablePadding
                sx={{ border: 1, borderColor: "lightgrey", background: "white" }}
              >
                {calculatedRows.map((session) => {
                  return (
                    <SessionItem
                      key={session.id}
                      session={session}
                      sessionList={sessionList}
                      versions={versions}
                    />
                  );
                })}
              </List>
            </div>
          )
        }
      </div>
    </div>
  );
};

SessionList.propTypes = {
  sessionList: PropTypes.array,
  versions: PropTypes.array,
};

export default SessionList;
