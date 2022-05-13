// Dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";

// Files
import { getLocalToken } from "../../utils/localStorage";
import { extractJwts } from "../../utils/extractJwts";
import { UserTable } from "./UserTable";
import { address } from "../../utils/config";

// Material UI
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import BadgeSharpIcon from "@mui/icons-material/BadgeSharp";
import DriveFileRenameOutlineSharpIcon from "@mui/icons-material/DriveFileRenameOutlineSharp";
import AssignmentSharpIcon from "@mui/icons-material/AssignmentSharp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import HighlightAltSharpIcon from "@mui/icons-material/HighlightAltSharp";
import FaceIcon from "@mui/icons-material/Face";

// Notification: The notification page that contains the user list, search bar and logout button
// This is the first page that renders after the admin click groups button
const Notification = () => {
  const [approvedState, setApprovedState] = useState(false);
  // Init the column that used to the UserTable
  const columns = [
    {
      accessor: "select",
      label: "",
      icon: <HighlightAltSharpIcon />,
      format: true,
      width: "50px",
    },
    {
      accessor: "approved",
      label: "Approved",
      icon: <AssignmentSharpIcon sx={{ mr: 1 }} />,
      format: (value) =>
        value ? (
          <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
        ) : (
          <DoDisturbOnIcon color="error" sx={{ fontSize: 28 }} />
        ),
      width: "110px",
    },
    {
      accessor: "email",
      label: "Email",
      icon: <EmailIcon sx={{ mr: 1 }} />,
      width: "280px",
    },
    {
      accessor: "username",
      label: "Username",
      icon: <FaceIcon sx={{ mr: 1 }} />,
      width: "150px",
    },
    {
      accessor: "firstName",
      label: "First Name",
      icon: <BadgeSharpIcon sx={{ mr: 1 }} />,
      width: "135px",
    },
    {
      accessor: "lastName",
      label: "Last Name",
      icon: <DriveFileRenameOutlineSharpIcon sx={{ mr: 1 }} />,
      width: "135px",
    },
  ];

  // Init the dependencies that used in notification page
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [rows, setRows] = useState([]);

  // Makes a request to our backend REST api and returns a list of users.
  useEffect(() => {
    // Extract the Jwts
    const jwt = getLocalToken();
    const payloads = extractJwts(jwt);
    const roleName = payloads.role;
    setRole(roleName);

    // admin
    let requestUrl = `${address}/users`;

    // When role of user is admin
    if (roleName === "admin") {
      axios
        .get(requestUrl)
        .then((response) => {
          setRows(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          // 404, Not Found. Set List to empty array
          setRows([]);
        });
    }
  }, [location.pathname, approvedState]);

  // Check the role of user
  if (role !== "admin") {
    return <div>Reject</div>;
  }

  // Display the loading before data request from backend
  if (loading) {
    return <div>Loading...</div>;
  }

  // Renders the notification page
  return (
    <div className="dashboard-container">
      <Container maxWidth="xl">
        {/* Table */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "black", marginTop: "20px" }}
        >
          List of Users on Server
        </Typography>

        <div className="sessions-list-container">
          <UserTable
            rows={rows}
            columns={columns}
            approvedState={approvedState}
            setApprovedState={setApprovedState}
          />
        </div>
      </Container>
    </div>
  );
};

export default Notification;
