// Dependencies
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Files
import { removeLocalToken, getLocalToken } from "../../utils/localStorage";
import logo from "../../images/vg-logo-dashboard.png";
import { extractJwts } from "../../utils/extractJwts";
import { address } from "../../utils/config";
import "./Header.css";

// Material UI
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import BackButton from "./BackButton";
import Badge from "@mui/material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";

const Header = (props) => {
  const { setToken } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [notify, setNotify] = useState(0);

  const logoutHandling = () => {
    setToken(null);
    removeLocalToken();
    navigate("/");
  };

  // Show the back button when the user is not on the main session list page
  function ShowHideButton() {
    if (location.pathname === "/") {
      return (
        <Link to="/">
          <img src={logo} className="Vg-Logo" alt="logo" height="50" />
        </Link>
      );
    } else {
      return <BackButton />;
    }
  }

  // Handler for the button after clicked will open the new window to navigate into Django Admin page
  const navigateToDjangoAdmin = () => {
    window.open(`${address}/admin/`);
  };

  // Makes a request to our backend REST api and return the state of notification.
  useEffect(() => {
    // Extract the Jwts
    // TODO: can handle this more securely this!!!
    const jwt = getLocalToken();
    const payloads = extractJwts(jwt);
    const roleName = payloads.role;
    setRole(roleName);

    // admin
    const requestUrl = `${address}/users`;

    /* When the role of user is admin */
    if (roleName === "admin") {
      // Hide the badge when the pathname is notification
      if (location.pathname === "/notification") {
        setNotify(0);
      }
      // Request data from backend, and filter out the number of users that disapproved
      else {
        axios
          .get(requestUrl)
          .then((response) => {
            const numberOfNotify = response.data.filter(
              (user) => !user.approved
            ).length;

            setNotify(numberOfNotify);
          })
          .catch((error) => {
            console.log(error);
            // 404, Not Found. Set List to empty array
            setNotify(0);
          });
      }
    }
  }, [location.pathname]);

  return (
    <div>
      <header className="header-container">
        <ShowHideButton />
        <div className="profile-logout-container">
          {/* When the role of user is admin
              Button of navigate to Django admin page */}
          {role === "admin" && (
            <div className="profile-button-container">
              <Button
                variant="contained"
                onClick={navigateToDjangoAdmin}
                style={{
                  backgroundColor: "#2c8579",
                  width: "3.6em",
                  height: "3.6em",
                }}
              >
                <StorageIcon
                  style={{
                    fontSize: "2.8em",
                  }}
                />
              </Button>
            </div>
          )}

          {/* When the role of user is admin
              Button of navifate to notification page */}
          {role === "admin" && (
            <Link to="/notification">
              <div className="notification-content">
                <Button
                  variant="contained"
                  disabled={
                    location.pathname === "/notification" ? true : false
                  }
                  style={{
                    backgroundColor: "#2c8579",
                    width: "3.6em",
                    height: "3.6em",
                  }}
                >
                  <Badge
                    color="error"
                    badgeContent={notify}
                    overlap="circular"
                    invisible={
                      location.pathname === "/notification" ? true : false
                    }
                  >
                    <GroupsIcon
                      style={{
                        fontSize: "2.9em",
                      }}
                    />
                  </Badge>
                </Button>
              </div>
            </Link>
          )}

          {/* Button of navifate to user profile page */}
          <Link to="/user">
            <div className="profile-button-container">
              <Button
                variant="contained"
                disabled={location.pathname === "/user" ? true : false}
                style={{
                  backgroundColor: "#2c8579",
                  width: "3.6em",
                  height: "3.6em",
                }}
              >
                <PersonIcon
                  style={{
                    fontSize: "2.8em",
                  }}
                />
              </Button>
            </div>
          </Link>

          {/* Button of logout */}
          <div className="logout-button-container">
            <button
              className="button-53"
              role="button"
              onClick={logoutHandling}
            >
              LOG OUT
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

Header.propTypes = {
  setToken: PropTypes.func,
};
