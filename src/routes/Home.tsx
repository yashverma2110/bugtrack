import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import validator from "validator";
import Card from "../components/Card";
import { ChangeEvent } from "react-router/node_modules/@types/react";
import { client } from "../assets/api.config";
import Input from "../components/Input";
import "../assets/css/routes/Home.css";

export const Home = () => {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState<any>({});

  let { push } = useHistory();

  useEffect(() => {
    chrome.storage?.local?.get(["token"], function (result: any) {
      if (result.token) {
        push("/projects");
      }
    });
  }, [push]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const length = login ? 2 : 4;
    if (Object.values(userData).length < length) {
      return;
    }
    const payload = { ...userData };
    delete payload.confirm_password;
    let url = "/user/signup";
    if (login) {
      url = "/user/login";
    }
    const { data } = await client.post(url, payload);

    chrome.storage.local.set(
      { token: data.token, user: data.user },
      function () {
        console.log("user logged in successfully");
        push("/projects");
      }
    );
  };

  return (
    <div className="home-container">
      <div className="title">Welcome to Bugtrack</div>
      <div className="para">
        Track your project progress, create/assign/track bugs with ease, step up
        your game!!
      </div>
      <Card>
        <form className="signup-form">
          {!login && (
            <Input
              name="name"
              label="Name"
              required
              onChange={handleInputChange}
            />
          )}
          <Input
            name="email"
            label="Email"
            type="email"
            required
            validator={validator.isEmail}
            onChange={handleInputChange}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            required
            validator={(password) => validator.isLength(password, { min: 6 })}
            onChange={handleInputChange}
          />
          {!login && (
            <Input
              name="confirm_password"
              label="Confirm Password"
              required
              validator={(value) => value === userData.password}
              onChange={handleInputChange}
            />
          )}
          <div className="fl-col-ce">
            <button className="shadow" onClick={handleSubmit}>
              Submit
            </button>
            <div onClick={() => setLogin(!login)} className="switch-login">
              {login ? "Don't" : "Already"} have an account
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
