// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";

// Material UI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

// Files
import { getLocalToken } from "../../utils/localStorage";
import { extractJwts } from "../../utils/extractJwts";

// Syncfusion UI
import "./SearchBar.css";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";

// SearchBar: a component for the search bar that searches the list of sessions
// by game type, first name and last name. SearchBar is called in SessionList
const SearchBar = (props) => {
  // versions is the list of unique versions
  const { searchChangeHandling, versions } = props;

  const [disable, setDisable] = useState(false);
  const [game, setGame] = useState("");
  const [player, setPlayer] = useState("");
  const [date, setDate] = useState("");
  const [version, setVersion] = useState("");

  const handleChange = (e) => {
    let gameType = game;
    let playerName = player;
    let dateRange = date;
    let versionNumber = version;

    // Search for Game
    if (e.event === 1) {
      setGame(e.value);
      gameType = e.value;
      searchChangeHandling("1:" + e.value);
    }
    // Search for Player
    else if (e.event === 2) {
      setPlayer(e.value);
      playerName = e.value;
      searchChangeHandling("2:" + e.value);
    }
    // Search for Date Range
    else if (e.event === 3) {
      setDate(e.value.text);
      dateRange = e.value.text;
      searchChangeHandling("3:" + e.value.startDate + "/" + e.value.endDate);
    }
    // Search for Version
    else if (e.event === 4) {
      setVersion(e.value);
      versionNumber = e.value;
      searchChangeHandling("4:" + e.value);
    }

    // If all of the filter is empty
    if (
      gameType !== "" ||
      playerName !== "" ||
      dateRange !== "" ||
      versionNumber !== ""
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const handleClearClick = () => {
    setGame("");
    setPlayer("");
    setDate("");
    setVersion("");
    setDisable(false);
    searchChangeHandling("clear");
  };

  const displayVersions = () => {
    if (versions) {
      return versions.map((item) => (
        <MenuItem value={item} key="version">
          {item}
        </MenuItem>
      ));
    }
  };

  const endDate = new Date();

  const jwt = getLocalToken();
  const payloads = extractJwts(jwt);
  const role = payloads.role;

  // Renders the look and functionality of the search bar
  return (
    <div style={{ background: "white" }}>
      <Box
        sx={{
          borderColor: "lightgrey",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 400,
          pb: 3,
        }}
      >
        {/* Search Game */}
        <Box sx={{ ml: 1, mr: 1 }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Search Game
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Game"
              value={game}
              onChange={(e) => {
                handleChange({ event: 1, value: e.target.value });
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="bubbles">Bubbles</MenuItem>
              <MenuItem value="balloons">Balloons</MenuItem>
              <MenuItem value="climbing">Climbing</MenuItem>
              <MenuItem value="flying_rings">Flying Rings</MenuItem>
              <MenuItem value="archery">Archery</MenuItem>
              <MenuItem value="slice_saber">Slice Saber</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Search Version */}
        <Box sx={{ ml: 1, mr: 1 }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Search Version
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Version"
              value={version}
              onChange={(e) => {
                handleChange({ event: 4, value: e.target.value });
              }}
            >
              <MenuItem value="">None</MenuItem>
              {displayVersions()}
            </Select>
          </FormControl>
        </Box>

        <Box
          component="form"
          sx={{
            "& > :not(style)": { ml: 1, mr: 1, minWidth: 200 },
          }}
          noValidate
          autoComplete="off"
        >
          {/* Changes in the searchbar input will update the session list */}
          {role === "admin" && (
            <TextField
              label="Search Player"
              placeholder="Enter Player ..."
              variant="standard"
              type="text"
              id="header-search"
              name="s"
              style={{ minWidth: 300 }}
              value={player}
              onChange={(e) => {
                handleChange({ event: 2, value: e.target.value });
              }}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
            />
          )}
        </Box>

        <Box sx={{ minWidth: 300, height: 62, pt: 3, pb: 3, ml: 2, mr: 2 }}>
          <DateRangePickerComponent
            placeholder="Search Date Range"
            format="yyyy/MMM/dd"
            max={endDate}
            delayUpdate={true}
            openOnFocus={true}
            allowEdit={false}
            showClearButton={false}
            value={date}
            change={(e) => {
              handleChange({ event: 3, value: e });
            }}
          ></DateRangePickerComponent>
        </Box>

        <Box sx={{ m: 1, pt: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<DeleteIcon />}
            color="error"
            sx={{ height: 45, minWidth: 300, textTransform: "none" }}
            disabled={!disable}
            onClick={handleClearClick}
          >
            Clear Searches
          </Button>
        </Box>
      </Box>
    </div>
  );
};

// Checks the properties are a valid function type
SearchBar.propTypes = {
  searchChangeHandling: PropTypes.func,
  versions: PropTypes.array,
};

export default SearchBar;
