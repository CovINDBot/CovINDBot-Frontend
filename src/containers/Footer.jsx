import React from "react";
import GovImage from "../static/gov.jpeg";
import "../styles/footer.css";

const Footer = () => {
  return (
    <>
      <img
        src={GovImage}
        alt="Wear Mask : Government of India"
        className="gov_image"
      />
    </>
  );
};

export { Footer };
