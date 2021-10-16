import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./constants";

export const client = axios.create({
  baseURL: BASE_URL,
});

export const authClient = (token?: string) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization:
        "Bearer " + token ??
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTYxNzc4MTlkYTkyMjBmYWI1YjNmMDAiLCJpYXQiOjE2MzM3Nzc1Mzd9.KHE74ZrB1KddC_8c8AY7ssgqzbw0ssiO20enuz0DBpk",
    },
  });

export const useToken = () => {
  const [token, setToken] = useState<string>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTYxNzc4MTlkYTkyMjBmYWI1YjNmMDAiLCJpYXQiOjE2MzM3Nzc1Mzd9.KHE74ZrB1KddC_8c8AY7ssgqzbw0ssiO20enuz0DBpk"
  );

  useEffect(() => {
    chrome.storage?.local?.get(["token"], function (result: any) {
      if (result.token) {
        setToken(result.token);
      }
    });
  }, []);

  return token;
};
