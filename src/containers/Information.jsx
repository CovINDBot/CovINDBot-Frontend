import React from "react";
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
            <button className="baseBtn reqBtn">Request Help</button>
          </div>
          <div className="offerBtn">
            <h2 className="textOffReq">Provide Aid</h2>
            <h3 className="subtext_off_req">
              If you have any relevant information regarding the supply of Covid
              amenities or you are a supplier yourself, you may create an{" "}
              <strong style={{ color: "green" }}>Aid</strong> such that needy
              persons can contact you.
            </h3>
            <button className="baseBtn aidBtn">Provide AID</button>
          </div>
        </div>
      </div>
    </>
  );
};

export { Information };
