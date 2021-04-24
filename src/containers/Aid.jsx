import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import { ExpandableTableRow } from "../components/ExpandableTableRow.jsx";
import { prettyDate, getTextFromArray } from "../utils/humanize";
import { AID_SERVICE_ISSUE } from "../constants";
import "../styles/aid.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
});

const Aid = ({ data }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <h1 className="aidHead">Aid Services</h1>
      <div className="aid_view">
        <Paper className={classes.root}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow style={{ background: "rgb(224, 224, 224)" }}>
                <TableCell padding="checkbox" />
                <TableCell padding="checkbox" />
                <TableCell>Location</TableCell>
                <TableCell align="right">Amenities Provided</TableCell>
                <TableCell align="right">Contact</TableCell>
                <TableCell align="right">Date of Aid Offer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <ExpandableTableRow
                    key={index}
                    reportLink={AID_SERVICE_ISSUE(1231)}
                    expandComponent={
                      <TableCell colSpan="5">{row.message}</TableCell>
                    }
                    reportText="Report issue with service"
                  >
                    <TableCell component="th" scope="row">
                      {row.location}
                    </TableCell>
                    <TableCell align="right">
                      {getTextFromArray(row.amenity)}
                    </TableCell>
                    <TableCell align="right">{row.contact}</TableCell>
                    <TableCell align="right">{prettyDate(row.date)}</TableCell>
                  </ExpandableTableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
};

export { Aid };
