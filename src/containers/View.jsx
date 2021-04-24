import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import FormHelperText from "@material-ui/core/FormHelperText";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import TwitterIcon from "@material-ui/icons/Twitter";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Aid } from "./Aid.jsx";
import { Request } from "./Request.jsx";

import { humanize } from "../utils/humanize";
import { getRequest } from "../utils/serviceCall";
import { DEFAULT_FILTERS } from "../constants";
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

const View = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(DEFAULT_FILTERS);
  const [hasChange, setHasChange] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [serviceData, setServiceData] = useState({
    type: "None",
    data: [],
  });

  const fetchAmenities = async () => {
    const response = await getRequest("/amenity");
    const { data } = response;
    setAmenities(data.data.map((amenity) => amenity.amenity_name));
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const deleteAmenity = (amenityDel) => {
    const newAmenities = currentFilters.amenities.filter((amenity) => {
      if (amenity === amenityDel) return false;
      return true;
    });
    setHasChange(true);
    setCurrentFilters({ ...currentFilters, amenities: newAmenities });
  };

  const addToAmenity = (amenity) => {
    const newAmenities = currentFilters.amenities;
    newAmenities.push(amenity);
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
            deleteAmenity(amenity);
          }}
        />
      );
    });

    return chipArray;
  };

  const applyChanges = () => {
    setHasChange(false);
    setOpen(false);
  };

  const handleSwitchChange = (event, amenity) => {
    if (event.target.checked) {
      addToAmenity(amenity);
    } else {
      deleteAmenity(amenity);
    }
  };

  const getAmenityFilterList = () => {
    return amenities.map((amenity, index) => {
      return (
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={currentFilters.amenities.includes(amenity)}
              onChange={(event) => handleSwitchChange(event, amenity)}
            />
          }
          label={amenity}
          labelPlacement="bottom"
          key={amenity}
          className="switchDes"
        />
      );
    });
  };

  const constructTwitterLink = () => {
    const BASE_TWITTER = "https://twitter.com/search?q=";
    let twitterLink = BASE_TWITTER;
    if (currentFilters.type === "Request") twitterLink += `required+`;
    else twitterLink += `verified+`;
    twitterLink += currentFilters.location + "+%28";
    currentFilters.amenities.forEach((amenity, index) => {
      let amenityToAdd =
        amenity === "Tiffin, Groceries and other Supplies"
          ? "supplies"
          : amenity;
      if (index === currentFilters.amenities.length - 1) {
        twitterLink += amenityToAdd.toLowerCase();
      } else {
        twitterLink += amenityToAdd.toLowerCase() + "+OR+";
      }
    });
    if (currentFilters.type === "Request")
      twitterLink += "%29+-%22verified%22&f=live";
    else twitterLink += "%29+-%22required%22&f=live";
    return twitterLink;
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
            <div className="filterList">
              <div className="filterTextOrSelect">
                <TextField
                  required
                  variant="outlined"
                  id="standard-required"
                  label="Location"
                  className="textSelect"
                  value={humanize(currentFilters.location)}
                  onChange={(event) => {
                    setHasChange(true);
                    setCurrentFilters({
                      ...currentFilters,
                      location: event.target.value,
                    });
                  }}
                  helperText="Please ensure that the spelling is correct"
                />
              </div>
              <div className="filterTextOrSelect">
                <FormControl variant="outlined" className="textSelect">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currentFilters.type}
                    onChange={(event) => {
                      setHasChange(true);
                      setCurrentFilters({
                        ...currentFilters,
                        type: event.target.value,
                      });
                    }}
                  >
                    <MenuItem value={"Request"}>Request Help</MenuItem>
                    <MenuItem value={"Aid"}>Provide Aid</MenuItem>
                  </Select>
                  <FormHelperText>Type of service you want</FormHelperText>
                </FormControl>
              </div>
            </div>
            <div className="dateFilter">
              <div className="dateIndFilter">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Start Date"
                    format="MM/dd/yyyy"
                    value={currentFilters.startDate}
                    onChange={(date) => {
                      setHasChange(true);
                      setCurrentFilters({
                        ...currentFilters,
                        startDate: date,
                      });
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="dateIndFilter">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="End Date"
                    format="MM/dd/yyyy"
                    value={currentFilters.endDate}
                    onChange={(date) => {
                      setHasChange(true);
                      setCurrentFilters({
                        ...currentFilters,
                        endDate: date,
                      });
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div className="amenityFilter">{getAmenityFilterList()}</div>
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
      <div className="twitterBtn">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<TwitterIcon />}
          onClick={() => {
            window.location.href = constructTwitterLink();
          }}
        >
          View Related Posts
        </Button>
      </div>
      {serviceData.type === "Request" && <Request data={serviceData.data} />}
      {serviceData.type === "Aid" && <Aid data={serviceData.data} />}
      {serviceData.type === "None" && <div className="keepFooterAtBottom" />}
      <Request data={[]}/>
    </>
  );
};

export { View };
