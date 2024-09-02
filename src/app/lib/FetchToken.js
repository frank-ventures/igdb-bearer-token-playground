"use server";

let cachedToken = null;
let tokenExpirationTime = null;

const clientId = process.env.TWITCH_TV_ID;
const clientSecret = process.env.TWITCH_TV_SECRET;

export async function fetchNewToken() {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    console.error(
      "Error fetching new token:",
      response.status,
      response.statusText
    );
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Fetch Response status:", response.status);
  console.log("Fetch Response token (line 31 route.js):", data.access_token);

  cachedToken = data.access_token;
  console.log("'New' token fetched.");

  //validate here
  //   const isValid = await validateToken();
  //   if (!isValid) {
  //     console.log("Token is invalid, poops...");
  //     throw new Error("Invalid token fetched from API.");
  //   }
  //   console.log("Token validated. Getting Expiry Date...");
  // Calculate the expiration time
  tokenExpirationTime = new Date();
  tokenExpirationTime.setSeconds(
    tokenExpirationTime.getSeconds() + data.expires_in
  );
  console.log("route.js ln47: This new bearer token is: ", cachedToken);

  console.log("This bearer expiration time is ", tokenExpirationTime);
  return cachedToken;
}

export async function validateToken() {
  console.log("Validating this  token:, ", cachedToken);
  const response = await fetch("https://id.twitch.tv/oauth2/validate", {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${cachedToken}`,
    },
  });
  console.log(
    "Response result of validateToken is: ",
    response.status,
    response.statusText
  );

  if (response.ok) {
    const data = await response.json();
    console.log("this is the validation response: ", data);
    const currentTime = new Date();
    tokenExpirationTime = new Date(
      currentTime.getTime() + data.expires_in * 1000
    );
    console.log("Token Validation Response was ok!");
    console.log(
      "This bearer expiration time, after validation, is ",
      tokenExpirationTime
    );
    return true;
  } else if (response.status === 401) {
    return false;
  } else {
    console.log("Oh no! Token is invalid or expired!");
    console.log("Token Validation Response: ", response);
    console.error(
      "Unexpected response during token validation:",
      response.status,
      response.statusText
    );
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function getToken() {
  console.log("getToken is logging the current cached token: ", cachedToken);
  if (!cachedToken || new Date() > tokenExpirationTime) {
    console.log("This is where I would be fetching a new token...");
    return;
    //   return await fetchNewToken();
  }

  const isValid = await validateToken();
  console.log("validating...");
  if (!isValid) {
    console.log("Token is invalid, fetching new token...");
    return;
    //   return await fetchNewToken();
  }
  console.log("Returning cachedToken...");

  return cachedToken;
}

export async function getExpirationTime() {
  console.log("get expiration called, its ,", tokenExpirationTime);
  console.log({ tokenExpirationTime });
  return tokenExpirationTime?.toString();
}

export async function getFunction(request, response) {
  try {
    console.log("GET called, running getToken...");
    // console.log("API headers, ", request.headers.get("authorization"));
    // const authcheck = request.headers.get("authorization");
    const token = await getToken();
    console.log("Returning token from GET...");
    return token;
  } catch (error) {
    console.error("Error in token handler:", error);
    return { error: "Internal Server Error", status: 500 };
  }
}
