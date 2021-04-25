import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Footer } from "./Footer.jsx";

import { getRequest } from "../utils/serviceCall";
import { humanize, getTextFromArray } from "../utils/humanize";

import "../styles/createForm.css";

const INIT_STATE = {
  location: "",
  message: "",
  contact: "",
  amenities: [],
};

const SNACKBAR_INIT = {
  open: false,
  message: "",
  severity: "",
};

const AidDashboard = () => {
  const [amenities, setAmenities] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [currentAid, setCurrentAid] = useState(INIT_STATE);
  const [open, setOpen] = React.useState(false);
  const [snackbarInfo, setSnackBarInfo] = useState(SNACKBAR_INIT);

  const handleSnackBarOpen = (message, severity) => {
    setSnackBarInfo({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarInfo(SNACKBAR_INIT);
  };

  const handleClickOpen = () => {
    if (!currentAid.location) {
      handleSnackBarOpen("Location cannot be empty", "error");
      return;
    }
    if (!currentAid.contact) {
      handleSnackBarOpen("Contact cannot be empty", "error");
      return;
    }
    if (currentAid.amenities.length === 0) {
      handleSnackBarOpen("Please select some amenities", "error");
      return;
    }
    if (!currentAid.message) {
      handleSnackBarOpen("You haven't entered any message", "warning");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
  }, []);

  const deleteAmenity = (amenityDel) => {
    let newAmenities = currentAid.amenities.filter((amenity) => {
      if (amenity === amenityDel) return false;
      return true;
    });
    setCurrentAid({
      ...currentAid,
      amenities: newAmenities ? newAmenities : [],
    });
  };

  const addToAmenity = (amenity) => {
    const newAmenities = currentAid.amenities;
    newAmenities.push(amenity);
    setCurrentAid({ ...currentAid, amenities: newAmenities });
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
              checked={currentAid.amenities.includes(amenity)}
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

  return (
    <>
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={snackbarInfo.severity}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Review Aid</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h4 className="dialogInfo">
              Location :{" "}
              <span className="checkInfo">
                {humanize(currentAid.location)}
              </span>
            </h4>

            <h4 className="dialogInfo">
              Contact :{" "}
              <span className="checkInfo">{currentAid.contact}</span>
            </h4>
            <h4 className="dialogInfo">Message</h4>
            <span className="wrap">{currentAid.message}</span>
            <h4 className="dialogInfo">Amenities Offered</h4>
            {getTextFromArray(currentAid.amenities)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Submit Aid
          </Button>
        </DialogActions>
      </Dialog>
      <div className="backToHomeHolder">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="backToHome">
            <ArrowBackIcon />
            <h4 className="backToHomeText">Back to Home</h4>
          </div>
        </Link>
      </div>
      <div className="formHolder">
        <h1 className="formHead">Offer Aid</h1>
        <div className="form">
          <Autocomplete
            className="form-textfield"
            options={availableLocations}
            getOptionLabel={(option) => humanize(option)}
            value={humanize(currentAid.location)}
            onInputChange={(_event, newInputValue) => {
              if (
                currentAid.location.toLowerCase() ===
                newInputValue.toLowerCase()
              )
                return;
              setCurrentAid({
                ...currentAid,
                location: newInputValue.toLowerCase(),
              });
            }}
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
          <TextField
            required
            variant="outlined"
            className="form-textfield"
            label="Contact"
            helperText="How to contact you ( Phone, Email etc )"
            value={currentAid.contact}
            onChange={(event) => {
              setCurrentAid({
                ...currentAid,
                contact: event.target.value,
              });
            }}
          />
          <h2 className="amenityHead">Amenities Offered</h2>
          <div className="amenitiesForm">{getAmenityFilterList()}</div>
          <TextField
            className="form-multiline"
            label="Message"
            multiline
            rows={5}
            helperText="Enter your message here"
            variant="outlined"
            value={currentAid.message}
            onChange={(event) => {
              setCurrentAid({
                ...currentAid,
                message: event.target.value,
              });
            }}
          />
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Submit Aid
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export { AidDashboard };
