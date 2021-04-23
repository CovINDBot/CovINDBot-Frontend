import React from "react";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { Information } from "./Information.jsx";
import { View } from "./View.jsx";
import "../styles/app.css";
const App = () => {
  return (
    <>
      <div className="app">
        <Header />
        <div className="information">
          <Information />
        </div>
        <View />
        {/* <Footer /> */}
      </div>
    </>
  );
};

export { App };
