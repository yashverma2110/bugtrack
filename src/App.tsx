import React from "react";
import { Route, Switch } from "react-router-dom";
import { Projects } from "./routes/Projects";
import { Home } from "./routes/Home";
import blobSvg from "./assets/images/blob.svg";

import "./App.css";
import Bugs from "./routes/Bugs";

export const App = () => {
  return (
    <div className="root-container">
      <div className="main-content">
        <Switch>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/project/:id">
            <Bugs />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
      <img src={blobSvg} alt="blob" className="blob-bkg" />
    </div>
  );
};
