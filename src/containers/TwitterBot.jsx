import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import "../styles/bot.css";

const TwitterBot = () => {
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
      <div className="twitterBot">
        <h1 className="botHead">View Results of Twitter Bot</h1>
        <div className="tweets">
          <a
            className="twitter-timeline"
            href="https://twitter.com/CovINDBot?ref_src=twsrc%5Etfw"
          >
            Tweets by CovINDBot
          </a>
        </div>
      </div>
    </>
  );
};

export { TwitterBot };
