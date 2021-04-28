import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { getRequest } from "../utils/serviceCall";
import { humanize } from "../utils/humanize";

import "../styles/search.css";

const INIT_STATE = {
  location: null,
  locationInp: null,
  amenities: [],
};

const Search = ({ authResponse }) => {
  const [amenities, setAmenities] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [param, setParam] = useState(INIT_STATE);

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
  }, []);

  const deleteAmenity = (amenityDel) => {
    let newAmenities = param.amenities.filter((amenity) => {
      if (amenity === amenityDel) return false;
      return true;
    });
    setParam({
      ...param,
      amenities: newAmenities ? newAmenities : [],
    });
  };

  const addToAmenity = (amenity) => {
    const newAmenities = param.amenities;
    newAmenities.push(amenity);
    setParam({ ...param, amenities: newAmenities });
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
              checked={param.amenities.includes(amenity)}
              onChange={(event) => handleSwitchChange(event, amenity)}
            />
          }
          label={amenity}
          labelPlacement="bottom"
          key={amenity}
          className="search-switchDes"
        />
      );
    });
  };

  const redirect_blank = (url) => {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.click();
  };

  const constructTwitterLink = () => {
    const BASE_TWITTER = "https://twitter.com/search?q=";
    let twitterLink = BASE_TWITTER;
    twitterLink += `verified+`;
    twitterLink += (param.locationInp ? param.locationInp : "") + "+%28";
    param.amenities.forEach((amenity, index) => {
      let amenityToAdd =
        amenity === "Tiffin, Groceries and other Supplies"
          ? "supplies"
          : amenity;
      if (index === param.amenities.length - 1) {
        twitterLink += amenityToAdd.toLowerCase();
      } else {
        twitterLink += amenityToAdd.toLowerCase() + "+OR+";
      }
    });
    twitterLink += "%29+";
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
    return twitterLink;
  };

  // Facebook's Graph Search is b*****it
  const constructFBLink = () => {
    const BASE_FACEBOOK = "https://www.facebook.com/search/posts/?q=";
    let facebookLink = BASE_FACEBOOK;
    facebookLink += `verified%20`;
    facebookLink += (param.locationInp ? param.locationInp : "") + "%20";
    param.amenities.forEach((amenity, index) => {
      facebookLink += amenity.toLowerCase() + "%20";
    });
    facebookLink = facebookLink.slice(0, facebookLink.length - 3);
    return facebookLink;
  };
  return (
    <>
      <div className="backToHomeHolder">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="backToHome">
            <ArrowBackIcon />
            <h4 className="backToHomeText">Back to Home</h4>
          </div>
        </Link>
      </div>
      <div className="search-formHolder">
        <h1 className="search-formHead">
          Search for Leads on Twitter, Facebook
        </h1>
        <div className="search-form">
          <Autocomplete
            className="search-form-textfield"
            options={availableLocations}
            getOptionLabel={(option) => humanize(option)}
            value={param.location}
            autoHighlight
            onInputChange={(_event, newInputValue) => {
              setParam({
                ...param,
                locationInp: newInputValue ? newInputValue.toLowerCase() : null,
              });
            }}
            onChange={(_event, newInputValue) => {
              setParam({
                ...param,
                location: newInputValue ? newInputValue.toLowerCase() : null,
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
          <h2 className="amenityHead">Amenities Required</h2>
          <div className="amenitiesForm">{getAmenityFilterList()}</div>
          <div className="search-social-btns">
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
        </div>
      </div>
    </>
  );
};

export { Search };
