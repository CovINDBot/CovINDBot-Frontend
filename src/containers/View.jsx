import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import Fab from "@material-ui/core/Fab";

import { humanize } from "../utils/humanize";
import "../styles/view.css";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    background: "rgb(223, 223, 223)",
    textAlign: "center",
  },
}));

const DEFAULT_FILTERS = {
  location: "india",
  amenities: ["ICU", "Bed"],
  type: "Request",
};

const View = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(DEFAULT_FILTERS);
  const [hasChange, setHasChange] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const deleteAmenity = (indexDel) => {
    if (currentFilters.amenities.length <= indexDel) return;
    const newAmenities = currentFilters.amenities.filter((_amenity, index) => {
      if (index === indexDel) return false;
      return true;
    });
    setHasChange(true);
    setCurrentFilters({ ...currentFilters, amenities: newAmenities });
  };

  const getChips = () => {
    const chipArray = [];
    let counter = 0;

    chipArray.push(
      <Chip
        key={counter++}
        label={humanize(currentFilters.type)}
        color="primary"
        className="chips"
        onDelete={() => {
          const switchType =
            currentFilters.type === "Request" ? "Aid" : "Request";
          setHasChange(true);
          setCurrentFilters({ ...currentFilters, type: switchType });
        }}
      />
    );

    if (currentFilters.location) {
      chipArray.push(
        <Chip
          key={counter++}
          label={humanize(currentFilters.location)}
          color="secondary"
          className="chips"
          onDelete={() => {
            setHasChange(true);
            setCurrentFilters({ ...currentFilters, location: "" });
          }}
        />
      );
    }

    currentFilters.amenities.forEach((amenity, index) => {
      chipArray.push(
        <Chip
          key={counter++}
          label={humanize(amenity)}
          color="secondary"
          className="chips"
          onDelete={() => {
            deleteAmenity(index);
          }}
        />
      );
    });

    return chipArray;
  };

  const applyChanges = () => {
    setHasChange(false);
  };

  return (
    <>
      <div className="filterRoot">
        <List component="nav" aria-labelledby="list-subheader">
          <ListItem className={classes.listItem} button onClick={handleClick}>
            <ListItemText>
              <h3 className="filterHead">Filter Aids / Requests</h3>
            </ListItemText>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <h1>Hi</h1>
          </Collapse>
        </List>
        <div className="filter_values">{getChips()}</div>
        {hasChange && (
          <div className="applyBtnHolder">
            <Fab color="default" variant="extended" onClick={applyChanges}>
              <DirectionsRunIcon className={classes.extendedIcon} />
              Apply Changes
            </Fab>
          </div>
        )}
      </div>
    </>
  );
};

export { View };
