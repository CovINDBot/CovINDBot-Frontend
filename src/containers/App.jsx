import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "./Header.jsx";
import { HomePage } from "./HomePage.jsx";
import { RequestDashboard } from "./RequestDashboard.jsx";
import { AidDashboard } from "./AidDashboard.jsx";
import { AuthenticatedRoute } from "../components/AuthenticatedRoute.jsx";
import { TwitterBot } from "./TwitterBot.jsx";

const App = () => {
  return (
    <>
      <Header />
      <Router>
        <Switch>
          <Route path="/request">
            <AuthenticatedRoute renderComponent={RequestDashboard} />
          </Route>
          <Route path="/aid">
            <AuthenticatedRoute renderComponent={AidDashboard} />
          </Route>
          <Route path="/bot">
            <TwitterBot />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export { App };
