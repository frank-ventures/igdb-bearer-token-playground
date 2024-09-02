import GetNewToken from "./components/GetNewToken";
import CheckTokenExists from "./components/CheckTokenExists";
import ValidateStoredToken from "./components/ValidateStoredToken";
import RunGetFunction from "./components/RunGetFunction";
import { fetchNewToken, validateToken } from "./lib/FetchToken";

export default async function Home() {
  console.log("Here's the home page doing some stuff:");
  const tokenResponse = await fetchNewToken();
  console.log("logging token response in home: ", tokenResponse);
  const tokenValidation = await validateToken();
  console.log("logging validation response in home: ", tokenValidation);

  return (
    <>
      <div className="intro-section">
        <h1>What is this?</h1>
        <p>
          Server-side getToken result:{" "}
          {tokenResponse ? tokenResponse : "nothing"}
        </p>

        <p>
          In the GameLog app I was battling with a way of doing proper Bearer
          Token management
        </p>
        <p>Proper meaning : </p>
        <ul>
          <li>Check if a token is already stored</li>
          <li>Validate it if it is</li>
          <li>Fetch one if it isnt</li>
          <li>Store it once fetched</li>
          <li>
            Make sure the app isnt fetching 500 bearer tokens all day
            everyday...
          </li>
        </ul>
        <p>
          This app is a playground for me to sort out a way to get it working
        </p>
      </div>

      <CheckTokenExists />
      <ValidateStoredToken />
      <GetNewToken />
      <RunGetFunction />
    </>
  );
}
