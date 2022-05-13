// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Material UI
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Box from "@mui/material/Box";

// Function to updating the pages that been selected
export function CustomPaginateRows(rows, activePage, rowsPerPage) {
  return [...rows].slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
}

// Custom components of pagination
export const CustomPagination = ({ activePage, count, rowsPerPage, totalPages, setActivePage, itemName }) => {
  const beginning = (activePage === 1 ? (count === 0 ? 0 : 1) : rowsPerPage * (activePage - 1) + 1);
  const end = activePage === totalPages ? count : beginning + rowsPerPage - 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack direction="row" spacing={2}>

        <Button 
          variant="contained"
          disabled={activePage === 1} 
          onClick={() => setActivePage(1)}
        >
          <FirstPageIcon sx={{ fontSize: 28 }} />
        </Button>

        <Button 
          variant="outlined" 
          disabled={activePage === 1} 
          onClick={() => setActivePage(activePage - 1)}
        >
          <NavigateBeforeIcon sx={{ fontSize: 28 }} />
        </Button>

        <Button 
          variant="outlined" 
          disabled={activePage === totalPages} 
          onClick={() => setActivePage(activePage + 1)}
        >
          <NavigateNextIcon sx={{ fontSize: 28 }} />
        </Button>

        <Button 
          variant="contained"
          disabled={activePage === totalPages} 
          onClick={() => setActivePage(totalPages)}
        >
          <LastPageIcon sx={{ fontSize: 28 }} />
        </Button>

      </Stack>
      
      <Box sx={{ pt: 2, textAlign: "center" }}>
        <p>Page {activePage} of {totalPages}</p>
      </Box>
      
      <Box sx={{ pt: 1, textAlign: "center" }}>
        <p>{itemName}: {beginning === end ? end : beginning + "-" + end} of {count}</p>
      </Box>
      
    </Box>
  );
};

CustomPagination.propTypes = {
  activePage: PropTypes.number, 
  count: PropTypes.number, 
  rowsPerPage: PropTypes.number, 
  totalPages: PropTypes.number, 
  setActivePage: PropTypes.func, 
  itemName: PropTypes.string,
};
