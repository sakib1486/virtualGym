// Dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";

// Files
import { getLocalToken } from "../../utils/localStorage";
import { extractJwts } from "../../utils/extractJwts";
import { address } from "../../utils/config";

// Component imports
import SessionListHeader from "./SessionListHeader";
import SessionList from "./SessionList";
import Container from "@mui/material/Container";

// Dashboard: The main dashboard page that contains the session list, search bar and logout button
// This is the first page that renders after the user logs in
const Dashboard = () => {
  const [sessionList, setSessionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState([]);

  const getVersions = (versionList, session) => {
    if (versionList.includes(session["version"])) {
      return versionList;
    } else {
      return versionList.concat(session["version"]);
    }
  };

  // Makes a request to our backend REST api and returns a list of sessions.
  useEffect(() => {
    // Extract the Jwts
    const jwt = getLocalToken();
    const payloads = extractJwts(jwt);

    const role = payloads.role;
    const email = payloads.email;

    // admin
    let requestUrl = `${address}/sessions`;

    if (role == "user") {
      requestUrl = `${address}/sessions?email=${email}`;
    } else if (role == "admin") {
      requestUrl = `${address}/sessions`;
    }

    axios
      .get(requestUrl)
      .then((response) => {
        setSessionList(response.data);
        setVersions(response.data.reduce(getVersions, []));
        setLoading(false);

        return;
      })
      .catch((error) => {
        console.log(error);
        // 404, Not Found. Set List to empty array
        setSessionList([]);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Renders the logout button, the SessionListHeader that displays the virtual gym logo and
  // the SessionList that contains the list of sessions
  return (
    <div className="dashboard-container">
      <Container maxWidth="xl">
        <div className="session-list-header-container">
          <SessionListHeader />
        </div>
        <div className="sessions-list-container">
          <SessionList sessionList={sessionList} versions={versions} />
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
