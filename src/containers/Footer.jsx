import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <p>
          <span style={{ color: "orange" }}>Stay S</span>a
          <span style={{ color: "lightblue" }}>fe, </span>S
          <span style={{ color: "lightgreen" }}>tay Home</span>
        </p>
        <a
          href="https://github.com/Sid200026"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
        >
          <p className="author">
            <span style={{ color: "orange" }}>Made By</span>{" "}
            <span style={{ color: "lightblue" }}>Siddharth</span>{" "}
            <span style={{ color: "lightgreen" }}>Singha Roy</span>
          </p>
        </a>
      </div>
    </>
  );
};

export { Footer };
