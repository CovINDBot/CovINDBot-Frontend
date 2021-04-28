import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MailIcon from "@material-ui/icons/Mail";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import GitHubIcon from "@material-ui/icons/GitHub";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import SearchIcon from "@material-ui/icons/Search";
import TwitterIcon from "@material-ui/icons/Twitter";
import { GITHUB_REPOSITORY, TWITTER_LINK, MAIL_LINK } from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "#1876D1",
  },
  title: {
    flexGrow: 1,
    fontFamily: "Georgia",
  },
  icon: {
    marginLeft: "1rem",
  },
}));

const SNACKBAR_INIT = {
  open: false,
  message: "",
  severity: "",
};

const Header = () => {
  const classes = useStyles();
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

  const handlePageChange = (page_link) => {
    window.location.href = page_link;
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={snackbarInfo.severity}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {window.innerWidth >= 500 && (
            <Typography variant="h6" noWrap className={classes.title}>
              Covid <span style={{ color: "orange", fontWeight: 900 }}>In</span>
              d<span style={{ color: "lightgreen", fontWeight: 900 }}>ia</span>{" "}
              Bot ( Cov
              <span style={{ color: "orange", fontWeight: 900 }}>I</span>
              <span>N</span>
              <span style={{ color: "lightgreen", fontWeight: 900 }}>D</span>Bot
              )
            </Typography>
          )}
          {window.innerWidth < 500 && (
            <Typography variant="h6" noWrap className={classes.title}>
              Cov<span style={{ color: "orange", fontWeight: 900 }}>I</span>
              <span>N</span>
              <span style={{ color: "lightgreen", fontWeight: 900 }}>D</span>Bot
            </Typography>
          )}
          <Tooltip title="Search for leads">
            <IconButton
              className={classes.icon}
              color="inherit"
              aria-label="Search for leads"
              edge="end"
              onClick={() => window.location.href = "/search"}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send a query">
            <IconButton
              className={classes.icon}
              color="inherit"
              aria-label="Request help"
              edge="end"
              onClick={() => handlePageChange(MAIL_LINK)}
            >
              <MailIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View project on GitHub">
            <IconButton
              className={classes.icon}
              color="inherit"
              aria-label="Github"
              edge="end"
              onClick={() => handlePageChange(GITHUB_REPOSITORY)}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Twitter Bot">
            <IconButton
              className={classes.icon}
              color="inherit"
              aria-label="Twitter"
              edge="end"
              onClick={() => handlePageChange(TWITTER_LINK)}
            >
              <TwitterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle light/dark theme">
            <IconButton
              className={classes.icon}
              color="inherit"
              aria-label="toggle dark-bright mode"
              edge="end"
              onClick={() => handleSnackBarOpen("To be implemented", "error")}
            >
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export { Header };
