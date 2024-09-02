import CheckTokenExists from "../w-m-components/CheckTokenExists";
import RunGetFunction from "../w-m-components/RunGetFunction";
import GetNewToken from "../w-m-components/GetNewToken";
import ValidateStoredToken from "../w-m-components/ValidateStoredToken";

export default async function WorkingMethod() {
  return (
    <>
      <div>
        <h1>Heres a Working Method! Woo...</h1>
        <p>But it's kinda slow.</p>
      </div>
      <CheckTokenExists />
      <RunGetFunction />
      <GetNewToken />
      <ValidateStoredToken />
    </>
  );
}
