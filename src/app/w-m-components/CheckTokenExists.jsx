"use client";
import { useState } from "react";
import { getToken } from "../lib-working/FetchTokenWorking";
import { getExpirationTime } from "../lib-working/FetchTokenWorking";

export default function CheckTokenExists() {
  const [tokenResult, setTokenResult] = useState("check me");
  const [expiration, setExpiration] = useState();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setTokenResult(await getToken());
    setExpiration(await getExpirationTime());
    setLoading(false);
  };

  return (
    <div>
      <h3>(CheckTokenExists)Is there a token in storage?:</h3>
      <p>Calls getToken, which checks SupaBase for a token, then</p>
      <button onClick={handleClick}>Check it</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          this is the result:{" "}
          {tokenResult == null ? "stored cache is empty" : tokenResult}
        </p>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          this is the result:{" "}
          {expiration == null ? "stored date is empty" : expiration}
        </p>
      )}
    </div>
  );
}
