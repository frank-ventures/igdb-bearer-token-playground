"use client";
import { useState } from "react";
import { getFunction } from "../lib-working/FetchTokenWorking";

export default function RunGetFunction() {
  const [getResult, setGetResult] = useState("check get");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setGetResult(await getFunction());
    setLoading(false);
  };

  return (
    <div>
      <h3>(RunGetFunction.jsx) Check result of the GET route:</h3>
      <button onClick={handleClick}>Get it</button>
      {loading ? <p>Loading...</p> : <p>this is the result: {getResult}</p>}
    </div>
  );
}
