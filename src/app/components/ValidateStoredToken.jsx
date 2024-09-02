"use client";
import { useState } from "react";
import { validateToken } from "../lib/FetchToken";

export default function ValidateStoredToken() {
  const [tokenResult, setTokenResult] = useState("check me");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setTokenResult(await validateToken());
    console.log(tokenResult);
    setLoading(false);
  };

  return (
    <div>
      <h3>Validate whats in storage:</h3>
      <button onClick={handleClick}>Fetch it</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>this is the result: {tokenResult ? "true" : "false"}</p>
      )}
    </div>
  );
}
