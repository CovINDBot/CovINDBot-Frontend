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
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Aid } from "./Aid.jsx";
import { Request } from "./Request.jsx";

import { humanize, prettyDate } from "../utils/humanize";
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
  const [availableLocations, setAvailableLocations] = useState([]);
  const [serviceData, setServiceData] = useState({
    type: "None",
    data: [],
  });

  const fetchOfferData = async () => {
    const params = {
      location: currentFilters.locationInp,
      amenities: currentFilters.amenities,
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
    };
    const response = await getRequest("/offer", params);
    const { data } = response;
    const newOffers = data.data.map((offer) => {
      const param = {};
      param.id = offer.id;
      param.date = new Date(offer.date_of_offer);
      param.location = offer.location;
      param.message = offer.message;
      param.amenity = offer.Amenities.map((amenity) => amenity.amenity_name);
      param.contact = offer.contact;
      return param;
    });
    setServiceData({
      type: "Aid",
      data: newOffers,
    });
  };

  const fetchRequestData = async () => {
    const params = {
      location: currentFilters.locationInp,
      amenities: currentFilters.amenities,
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
    };
    const response = await getRequest("/request", params);
    const { data } = response;
    const newRequests = data.data.map((request) => {
      const param = {};
      param.id = request.id;
      param.date = new Date(request.date_of_request);
      param.location = request.location;
      param.message = request.message;
      param.amenity = request.Amenities.map((amenity) => amenity.amenity_name);
      param.contact = request.contact;
      return param;
    });
    setServiceData({
      type: "Request",
      data: newRequests,
    });
  };

  const fetchData = async () => {
    if (currentFilters.type === "Request") {
      fetchRequestData();
    } else {
      await fetchOfferData();
    }
  };

  const fetchAmenities = async () => {
    const response = await getRequest("/amenity");
    const { data } = response;
    setAmenities(data.data.map((amenity) => amenity.amenity_name));
  };

  const fetchLocations = async () => {
    const response = await getRequest("/location");
    const { data } = response;
    setAvailableLocations(data.data.map((location) => location.name));
  };

  useEffect(() => {
    fetchAmenities();
    fetchLocations();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const deleteAmenity = (amenityDel) => {
    let newAmenities = currentFilters.amenities.filter((amenity) => {
      if (amenity === amenityDel) return false;
      return true;
    });
    setHasChange(true);
    setCurrentFilters({
      ...currentFilters,
      amenities: newAmenities ? newAmenities : [],
    });
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

    chipArray.push(
      <Chip
        key={counter++}
        color="primary"
        className="chips"
        label={`Start Date : ${prettyDate(currentFilters.startDate)}`}
      />
    );

    chipArray.push(
      <Chip
        key={counter++}
        color="primary"
        className="chips"
        label={`End Date : ${prettyDate(currentFilters.endDate)}`}
      />
    );

    if (currentFilters.locationInp) {
      chipArray.push(
        <Chip
          key={counter++}
          label={humanize(currentFilters.locationInp)}
          color="secondary"
          className="chips"
          onDelete={() => {
            setHasChange(true);
            setCurrentFilters({
              ...currentFilters,
              locationInp: null,
              location: null,
            });
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
    fetchData();
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
    twitterLink +=
      (currentFilters.locationInp ? currentFilters.locationInp : "") + "+%28";
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
    twitterLink += "%29+";
    if (currentFilters.type === "Request") {
      ["verified", "verify", "verifies", "leads"].forEach((keyword) => {
        twitterLink += `-${keyword}+`;
      });
    } else {
      [
        "required",
        "needed",
        "needs",
        "requirements",
        "requires",
        "help",
        "needs",
      ].forEach((keyword) => {
        twitterLink += `-${keyword}+`;
      });
    }
    return twitterLink;
  };

  const constructFBLink = () => {
    const BASE_FACEBOOK = "https://www.facebook.com/search/posts/?q=";
    let facebookLink = BASE_FACEBOOK;
    if (currentFilters.type === "Request") facebookLink += `required%20`;
    else facebookLink += `verified%20`;
    facebookLink +=
      (currentFilters.locationInp ? currentFilters.locationInp : "") + "%20";
    currentFilters.amenities.forEach((amenity, index) => {
      facebookLink += amenity.toLowerCase() + "%20";
    });
    facebookLink = facebookLink.slice(0, facebookLink.length - 3);
    return facebookLink;
  };

  const redirect_blank = (url) => {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.click();
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
                <Autocomplete
                  id="combo-box-demo"
                  options={availableLocations}
                  getOptionLabel={(option) => humanize(option)}
                  value={currentFilters.location}
                  onChange={(event, newInputValue) => {
                    if (
                      currentFilters.location &&
                      newInputValue &&
                      currentFilters.location.toLowerCase() ===
                        newInputValue.toLowerCase()
                    )
                      return;
                    setHasChange(true);
                    setCurrentFilters({
                      ...currentFilters,
                      location: newInputValue ? newInputValue.toLowerCase() : null,
                      locationInp: newInputValue ? newInputValue.toLowerCase() : null,
                    });
                  }}
                  onInputChange={(event, newInputValue) => {
                    if (
                      currentFilters.locationInp &&
                      newInputValue &&
                      currentFilters.locationInp.toLowerCase() ===
                        newInputValue.toLowerCase()
                    )
                      return;
                    setHasChange(true);
                    setCurrentFilters({
                      ...currentFilters,
                      locationInp: newInputValue ? newInputValue.toLowerCase() : null,
                    });
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      variant="outlined"
                      id="standard-required"
                      label="Location"
                      className="textSelect"
                      helperText="Please ensure that the spelling is correct"
                    />
                  )}
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
                    id="date-picker-dialog1"
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
                    id="date-picker-dialog2"
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
      <div className="socialBtnHolder">
        <Button
          variant="outlined"
          color="primary"
          className="socialBtn"
          startIcon={<TwitterIcon />}
          onClick={() => {
            redirect_blank(constructTwitterLink());
          }}
        >
          View Related Posts
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FacebookIcon />}
          className="socialBtn"
          onClick={() => {
            redirect_blank(constructFBLink());
          }}
        >
          View Related Posts
        </Button>
      </div>
      {serviceData.type === "Request" && <Request data={serviceData.data} />}
      {serviceData.type === "Aid" && <Aid data={serviceData.data} />}
      {serviceData.type === "None" && <div className="keepFooterAtBottom" />}
    </>
  );
};

export { View };
