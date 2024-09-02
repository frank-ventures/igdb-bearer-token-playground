import GetNewToken from "../components/GetNewToken";
import CheckTokenExists from "../components/CheckTokenExists";
import ValidateStoredToken from "../components/ValidateStoredToken";
import { getToken } from "../lib/FetchToken";
import RunGetFunction from "../components/RunGetFunction";

export default async function Page2() {
  const response = await getToken();

  return (
    <div>
      <div>
        <h1>You are on Page 2! Wahoo!</h1>
        <p>Server-side getToken result: {response ? response : "nothing"}</p>
      </div>
      <CheckTokenExists />
      <ValidateStoredToken />
      <GetNewToken />
      <RunGetFunction />
    </div>
  );
}
