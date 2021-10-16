import React from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";

const Header = () => {
  let { push } = useHistory();

  const handleLogout = () => {
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (!error) {
        push("/");
      }
    });
  };

  return (
    <div className="fl-bw header">
      <div> Bugtrack</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;
