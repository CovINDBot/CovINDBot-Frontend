import React from "react";
import { Link } from "react-router-dom";
import { RESOURCE_URL } from "../constants";
import "../styles/information.css";

const Information = () => {
  return (
    <>
      <div className="about">
        <div className="redirectForOfferRequest">
          <div className="requestBtn">
            <h2 className="textOffReq">Request Help</h2>
            <h3 className="subtext_off_req">
              If you are in need of some aid like ICUs, Oxygen Cylinders,
              Remdesivir, etc. you can simply create a{" "}
              <strong style={{ color: "red" }}>Request</strong> for others to
              help you
            </h3>
            <Link to="/request" style={{ textDecoration: "none" }}>
              <button className="baseBtn reqBtn">Request Help</button>
            </Link>
          </div>
          <div className="offerBtn">
            <h2 className="textOffReq">Provide Aid</h2>
            <h3 className="subtext_off_req">
              If you have any relevant information regarding the supply of Covid
              amenities or you are a supplier yourself, you may create an{" "}
              <strong style={{ color: "green" }}>Aid</strong> such that needy
              persons can contact the service.
            </h3>
            <Link to="/aid" style={{ textDecoration: "none" }}>
              <button className="baseBtn aidBtn">Provide AID</button>
            </Link>
          </div>
        </div>
        <div className="additionalResource">
          <Link to="/bot" style={{ textDecoration: "none" }}>
            <button className="baseBtn botBtn">
              View Tweets on Twitter Bot
            </button>
          </Link>
          <a href={RESOURCE_URL} style={{ textDecoration: "none" }}>
            <button className="baseBtn resourceBtn">
              View Statewise Resources
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export { Information };
