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
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Footer } from "./Footer.jsx";

import { getRequest, postRequest } from "../utils/serviceCall";
import { humanize, getTextFromArray } from "../utils/humanize";

import "../styles/createForm.css";

const INIT_STATE = {
  location: null,
  message: "",
  contact: "",
  amenities: [],
  locationInp: null,
};

const SNACKBAR_INIT = {
  open: false,
  message: "",
  severity: "error",
  duration: 6000,
};

const RequestDashboard = ({ authResponse }) => {
  const [amenities, setAmenities] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(INIT_STATE);
  const [open, setOpen] = React.useState(false);
  const [snackbarInfo, setSnackBarInfo] = useState(SNACKBAR_INIT);

  const handleSnackBarOpen = (message, severity = "error", duration = 6000) => {
    setSnackBarInfo({
      open: true,
      message,
      severity,
      duration,
    });
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarInfo(SNACKBAR_INIT);
  };

  const handleClickOpen = () => {
    if (!currentRequest.locationInp) {
      handleSnackBarOpen("Location cannot be empty", "error");
      return;
    }
    if (!currentRequest.contact) {
      handleSnackBarOpen("Contact cannot be empty", "error");
      return;
    }
    if (currentRequest.amenities.length === 0) {
      handleSnackBarOpen("Please select some amenities", "error");
      return;
    }
    if (!currentRequest.message) {
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

  const addRequest = () => {
    const request = {
      message: currentRequest.message,
      contact: currentRequest.contact,
      location: currentRequest.locationInp,
      amenities: currentRequest.amenities,
      token: authResponse.token,
      authType: authResponse.provider,
    };
    postRequest("/request/protect/", request)
      .then((res) => {
        handleClose();
        handleSnackBarOpen("Request has been added", "success", 10000);
        setCurrentRequest(INIT_STATE)
      })
      .catch((err) => {
        handleClose();
        handleSnackBarOpen("Request could not be created", "error");
      });
  };

  useEffect(() => {
    fetchAmenities();
    fetchLocations();
  }, []);

  const deleteAmenity = (amenityDel) => {
    let newAmenities = currentRequest.amenities.filter((amenity) => {
      if (amenity === amenityDel) return false;
      return true;
    });
    setCurrentRequest({
      ...currentRequest,
      amenities: newAmenities ? newAmenities : [],
    });
  };

  const addToAmenity = (amenity) => {
    const newAmenities = currentRequest.amenities;
    newAmenities.push(amenity);
    setCurrentRequest({ ...currentRequest, amenities: newAmenities });
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
              checked={currentRequest.amenities.includes(amenity)}
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
        autoHideDuration={snackbarInfo.duration}
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
        <DialogTitle id="alert-dialog-title">Review Request</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
            <h4 className="dialogInfo">
              Location :{" "}
              <span className="checkInfo">
                {humanize(currentRequest.locationInp)}
              </span>
            </h4>

            <h4 className="dialogInfo">
              Contact :{" "}
              <span className="checkInfo">{currentRequest.contact}</span>
            </h4>
            <h4 className="dialogInfo">Message</h4>
            <span className="wrap">{currentRequest.message}</span>
            <h4 className="dialogInfo">Amenities Required</h4>
            {getTextFromArray(currentRequest.amenities)}
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addRequest} color="primary" autoFocus>
            Submit Request
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
        <h1 className="formHead">Request Help</h1>
        <div className="form">
          <Autocomplete
            className="form-textfield"
            options={availableLocations}
            getOptionLabel={(option) => humanize(option)}
            value={humanize(currentRequest.location)}
            onChange={(_event, newInputValue) => {
              setCurrentRequest({
                ...currentRequest,
                location: newInputValue ? newInputValue.toLowerCase() : null,
                locationInp: newInputValue ? newInputValue.toLowerCase() : null,
              });
            }}
            onInputChange={(_event, newInputValue) => {
              setCurrentRequest({
                ...currentRequest,
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
          <TextField
            required
            variant="outlined"
            className="form-textfield"
            label="Contact"
            helperText="How to contact you ( Phone, Email etc )"
            value={currentRequest.contact}
            onChange={(event) => {
              setCurrentRequest({
                ...currentRequest,
                contact: event.target.value,
              });
            }}
          />
          <h2 className="amenityHead">Amenities Required</h2>
          <div className="amenitiesForm">{getAmenityFilterList()}</div>
          <TextField
            className="form-multiline"
            label="Message"
            multiline
            rows={5}
            helperText="Enter your message here"
            variant="outlined"
            value={currentRequest.message}
            onChange={(event) => {
              setCurrentRequest({
                ...currentRequest,
                message: event.target.value,
              });
            }}
          />
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Submit Request
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export { RequestDashboard };
