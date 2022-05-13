// Dependencies
import * as React from "react";
import PropTypes from "prop-types";

// Material UI
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const ToolTip = ({ description }) => {
  ToolTip.propTypes = {
    description: PropTypes.string,
  };

  return (
    <Tooltip
      placement="top-start"
      sx={{ pt: "5px" }}
      title={
        <React.Fragment>
          <Typography variant="p" fontSize="15px">
            {description}
          </Typography>
        </React.Fragment>
      }
    >
      <HelpIcon />
    </Tooltip>
  );
};

export default ToolTip;
