"use client";
import { useState } from "react";
import {
  fetchNewToken,
  getExpirationTime,
} from "../lib-working/FetchTokenWorking";

export default function GetNewToken() {
  const [tokenResult, setTokenResult] = useState("check me");
  const [expiration, setExpiration] = useState();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setTokenResult(await fetchNewToken());
    setExpiration(await getExpirationTime());
    setLoading(false);
  };

  return (
    <div>
      <h3>(GetNewToken.jsx) Fetch a new one from the API:</h3>
      <button onClick={handleClick}>Fetch it</button>
      {loading ? <p>Loading...</p> : <p>this is the result: {tokenResult}</p>}
      {loading ? <p>Loading...</p> : <p>this is the result: {expiration}</p>}
    </div>
  );
}
