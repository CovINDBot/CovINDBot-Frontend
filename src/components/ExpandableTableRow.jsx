import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import Tooltip from "@material-ui/core/Tooltip";

const ExpandableTableRow = ({
  reportLink,
  children,
  expandComponent,
  reportText,
  ...otherProps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const report = () => {
    window.location.href = reportLink;
  };

  return (
    <>
      <TableRow {...otherProps}>
        <TableCell padding="checkbox">
          <Tooltip title="View Message" aria-label="add">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell padding="checkbox">
          <Tooltip title={reportText} aria-label="add">
            <IconButton onClick={report}>
              <ReportProblemIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell padding="checkbox" />
          {expandComponent}
        </TableRow>
      )}
    </>
  );
};

export { ExpandableTableRow };
