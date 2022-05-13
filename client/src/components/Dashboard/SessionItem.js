import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Session from "./Session";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";

// React Icons
import { IoBalloonSharp } from "react-icons/io5";
import { GiPocketBow } from "react-icons/gi";
import { GiLightSabers } from "react-icons/gi";
import { FaMountain } from "react-icons/fa";
import { GiLinkedRings } from "react-icons/gi";
import { RiBubbleChartFill } from "react-icons/ri";

// SessionItem: a component that renders Session and displays an icon based on the game name
// SessionItem is called in SessionList
const SessionItem = (props) => {
  const navigate = useNavigate();
  const { session, sessionList, versions } = props;

  // IconSelect: A function that displays an icon according to the game name
  /* eslint-disable indent */
  function IconSelect({ gameType }) {
    switch (gameType) {
      case "balloons":
        return <IoBalloonSharp size={32} />;
      case "archery":
        return <GiPocketBow size={32} />;
      case "slide-saber":
        return <GiLightSabers size={32} />;
      case "climbing":
        return <FaMountain size={32} />;
      case "flying-rings":
        return <GiLinkedRings size={32} />;
      case "bubbles":
        return <RiBubbleChartFill size={32} />;
      default:
        return null;
    }
  }

  // Renders the icon and Session component
  return (
    <ListItem
      button
      divider
      key={session.id}
      onClick={() =>
        navigate("/session", {
          state: {
            session: session,
            sessionList: sessionList,
            versions: versions,
          },
        })
      }
    >
      <ListItemIcon>
        <IconSelect gameType={session.gameType} />
      </ListItemIcon>
      <Session session={session} />
    </ListItem>
  );
};

export default SessionItem;

// Checks the properties are a object and string time. Session is required
SessionItem.propTypes = {
  session: PropTypes.object.isRequired,
  sessionList: PropTypes.array,
  versions: PropTypes.array,
  gameType: PropTypes.string,
};
