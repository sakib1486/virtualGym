// Dependencies
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

// Files
import "./UserTable.css";
import { address } from "../../utils/config";
import { ToastContainer, toast } from "react-toastify";

// Components
import {
  CustomPagination,
  CustomPaginateRows,
} from "../Template/CustomPagination";
import NotFoundScreen from "../Dashboard/NotFoundScreen";

// Material UI
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import axios from "axios";

// Render the UserTable
export const UserTable = ({
  rows,
  columns,
  approvedState,
  setApprovedState,
}) => {
  // Init disable for filter button of approve and disapprove
  const [approveVariant, setApproveVariant] = useState("outlined");
  const [disapproveVariant, setDisapproveVariant] = useState("outlined");

  // Init checkbox for selected the user
  const [numSelect, setNumSelect] = useState(0);
  const [selected, setSelected] = useState({});

  // Init Custom Pagination
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState({});
  const rowsPerPage = 10;
  const itemName = "User";

  // Renders the users list when the filter is in use
  const filteredRows = useMemo(() => {
    if (filters.length) return rows;

    return rows.filter((row) => {
      return Object.keys(filters).every((accessor) => {
        const value = row[accessor] ? row[accessor] : false;
        const searchValue = filters[accessor];

        // Check the value is boolean or not
        if (value === true || value === false) {
          return (
            (searchValue === "true" && value) ||
            (searchValue === "false" && !value)
          );
        }

        return false;
      });
    });
  }, [rows, filters]);

  // Function that calling when the pagination is on changing
  const calculatedRows = CustomPaginateRows(
    filteredRows,
    activePage,
    rowsPerPage
  );

  const count = filteredRows.length;
  const totalPages = Math.ceil(count / rowsPerPage);

  // Function that can split the searching value of the column
  const handleSearch = (value, accessor) => {
    setActivePage(1);

    // Value is not emprt
    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }));
      // Value is empty
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[accessor];

        return updatedFilters;
      });
    }
  };

  // Handle of approve filter button that get the value when user clicked the button
  const handleApproveFilterButton = (value) => {
    const approveState = approveVariant === "outlined";
    const disapproveState = disapproveVariant === "outlined";

    /* value means which button is clicked
      1: Approve Filter Button
      2: Disapprove Filter Button
    */
    if (value === "1") {
      // Approve: unchecked vs. Disapprove: unchecked
      if (approveState && disapproveState) {
        handleSearch("true", "approved");
        setApproveVariant("contained");
        setNumSelect(0);
        setSelected({});
        // Approve: unchecked vs. Disapprove: checked
      } else if (approveState && !disapproveState) {
        handleSearch("true", "approved");
        setApproveVariant("contained");
        setDisapproveVariant("outlined");
        setNumSelect(0);
        setSelected({});
        // Approve: checked vs. Disapprove: unchecked
      } else {
        setActivePage(1);
        setFilters({});
        setApproveVariant("outlined");
        setNumSelect(0);
        setSelected({});
      }
    } else {
      // Approve: unchecked vs. Disapprove: unchecked
      if (approveState && disapproveState) {
        handleSearch("false", "approved");
        setDisapproveVariant("contained");
        setNumSelect(0);
        setSelected({});
        // Approve: checked vs. Disapprove: unchecked
      } else if (!approveState && disapproveState) {
        handleSearch("false", "approved");
        setDisapproveVariant("contained");
        setApproveVariant("outlined");
        setNumSelect(0);
        setSelected({});
        // Approve: unchecked vs. Disapprove: checked
      } else {
        setActivePage(1);
        setFilters({});
        setDisapproveVariant("outlined");
        setNumSelect(0);
        setSelected({});
      }
    }
  };

  // Function that insert email in to the dir. depend on ckecked variable of checkbox
  const handleSelectUser = (e) => {
    // Checked: true => Insert email
    if (e.select) {
      setSelected((prevSelected) => ({
        ...prevSelected,
        [e.value]: true,
      }));

      setNumSelect(numSelect + 1);
      // Checked: false => Delete email
    } else {
      setSelected((prevSelected) => {
        const updatedSelected = { ...prevSelected };
        delete updatedSelected[e.value];

        return updatedSelected;
      });

      setNumSelect(numSelect - 1);
    }
  };

  // Handle that clear up the num of selections and the list of selected email
  const handleClearSelectedButton = () => {
    setNumSelect(0);
    setSelected({});
  };

  // Handle that submitting the list of selected email to the backend server to approve users
  const handleApproveSelectedButton = () => {
    const data = {
      users: Object.keys(selected),
    };

    axios.put(`${address}/users/`, data).then(() => {
      setApprovedState(!approvedState);
      setNumSelect(0);
      setSelected({});
      toast.success("Users successfully approved!");
    });
  };

  return (
    <div
      className="session-list-container"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
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
          {/* Display the number of users have been selected */}
          <Typography variant="h5" gutterBottom sx={{ color: "black", mt: 2 }}>
            Selections: {numSelect}
          </Typography>

          {/* The button of clear selection */}
          <Button
            variant="outlined"
            startIcon={<AssignmentTurnedInIcon />}
            size="large"
            sx={{ height: 45, minWidth: 300, mt: 2, textTransform: "none" }}
            disabled={useMemo(() => {
              return numSelect === 0;
            }, [numSelect])}
            onClick={handleApproveSelectedButton}
          >
            Approve Selected
          </Button>

          {/* The button of submitting the list of selected users */}
          <Button
            variant="outlined"
            startIcon={<DisabledByDefaultIcon />}
            size="large"
            color="secondary"
            sx={{
              height: 45,
              minWidth: 300,
              mt: 2,
              mb: 2,
              textTransform: "none",
            }}
            disabled={useMemo(() => {
              return numSelect === 0;
            }, [numSelect])}
            onClick={handleClearSelectedButton}
          >
            Clear Selection
          </Button>

          {/* Display the title of approve filter */}
          <Typography variant="h5" gutterBottom sx={{ color: "black", mt: 2 }}>
            Approve Filter
          </Typography>

          {/* The button of approve filter button */}
          <Button
            variant={approveVariant}
            startIcon={<CheckCircleIcon />}
            size="large"
            color="success"
            sx={{ height: 45, minWidth: 300, mt: 2, textTransform: "none" }}
            onClick={() => handleApproveFilterButton("1")}
          >
            Approved
          </Button>

          {/* The button of disapprove filter button */}
          <Button
            variant={disapproveVariant}
            startIcon={<DoDisturbOnIcon />}
            size="large"
            color="error"
            sx={{
              height: 45,
              minWidth: 300,
              mt: 2,
              mb: 4,
              textTransform: "none",
            }}
            onClick={() => handleApproveFilterButton("2")}
          >
            Disapproved
          </Button>

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

      {
        // Check the row is empty or not
        calculatedRows.length === 0 ? (
          // Row is empty
          <NotFoundScreen />
        ) : (
          // Row is not empty
          <div className="session-list" style={{ flexGrow: 6 }}>
            <table className="custom_user_table_table">
              {/* The header of table that display the title of each accessor */}
              <thead>
                <tr>
                  {columns.map((column) => {
                    const width = column.width;

                    // Retuen the compenonts of the title of each accessor with the icon
                    return (
                      <th
                        className="custom_user_table_th"
                        key={column.accessor}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            minWidth: width,
                          }}
                        >
                          {column.icon}
                          <span>{column.label}</span>
                        </Box>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* The button of approve filter button */}
              <tbody>
                {calculatedRows.map((row) => {
                  // Return the row of each tablerow based on the information of users
                  return (
                    <tr key={row.id}>
                      {columns.map((column) => {
                        // Check the column has 'format' as key or not
                        if (column.format) {
                          // Check the accessor of column is 'select'
                          if (column.accessor === "select") {
                            // Return the checkbox depend on the user is approve or not
                            return (
                              <td
                                className="custom_user_table_td"
                                key={column.accessor}
                              >
                                {row.approved ? (
                                  <Checkbox disabled checked />
                                ) : (
                                  <Checkbox
                                    checked={selected[row.email] ? true : false}
                                    onClick={(e) => {
                                      handleSelectUser({
                                        select: e.target.checked,
                                        value: row.email,
                                      });
                                    }}
                                  />
                                )}
                              </td>
                            );
                          }

                          // Return the normal stuff when the accessor of column is not 'select'
                          return (
                            <td
                              className="custom_user_table_td"
                              key={column.accessor}
                            >
                              {column.format(row[column.accessor])}
                            </td>
                          );
                        }

                        // Return the normal stuff when the column that do not has format as key
                        return (
                          <td
                            className="custom_user_table_td"
                            key={column.accessor}
                          >
                            {row[column.accessor]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};

UserTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  approvedState: PropTypes.bool,
  setApprovedState: PropTypes.func,
};
