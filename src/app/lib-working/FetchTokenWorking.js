"use server";
// --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Imports --- --- --- ---
// --- --- --- --- --- --- --- --- --- ---
import GetBearerFromSB from "./GetBearerFromSB";
import UpdateBearerToSB from "./UpdateBearerToSB";

// --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Variables --- --- ---
// --- --- --- --- --- --- --- --- --- ---
let cachedToken = null;
let tokenExpirationTime = null;

// --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- ENVs --- --- --- ---
// --- --- --- --- --- --- --- --- --- ---
const clientId = process.env.TWITCH_TV_ID;
const clientSecret = process.env.TWITCH_TV_SECRET;
const apiSecret = process.env.API_SECRET;

// --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Fetch a new token --- --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- ---
export async function fetchNewToken() {
  console.log("fetchNewToken() called. Getting a new one from Twitch...");
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    console.error(
      "Error fetching new token: ",
      response.status,
      response.statusText
    );
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("FetchNewToken Response status:", response.status);
  console.log("FetchNewToken success! (line 31 route.js):");
  cachedToken = data.access_token;
  console.log("New token fetched.");

  // Validate here
  const isValid = await validateToken();
  if (!isValid) {
    console.log("Token is invalid, poops...");
    throw new Error("Invalid token fetched from API.");
  }
  console.log("Token validated. Getting Expiry Date...");
  // Calculate the expiration time
  tokenExpirationTime = new Date();
  tokenExpirationTime.setSeconds(
    tokenExpirationTime.getSeconds() + data.expires_in
  );
  console.log("This bearer expiration time is ", tokenExpirationTime);

  console.log("Setting new token in Supabase Database...");
  UpdateBearerToSB(cachedToken, tokenExpirationTime);
  return cachedToken;
}

// --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Validate the token --- --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- ---
export async function validateToken() {
  console.log("Validating token...");
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
    console.log("This is the validation response: ", data);
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

// --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Check Supabase for Token --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- ---
export async function CheckSupabaseForToken() {
  console.log("Checking supabase...");
  const supaBearer = await GetBearerFromSB();
  if (!supaBearer) {
    throw new Error("Bad response from GetBearerFromSB()");
  }
  console.log("Supabase token found!");
  return supaBearer;
}

// --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Main GetToken function --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- ---
export async function getToken() {
  // First check if there's a stored token here already:
  if (!cachedToken || new Date() > tokenExpirationTime) {
    console.log("getToken did not detect a cachedToken, or the expiry is up.");
    // Second check Supabase for an entry
    console.log("Checking SupaBase for a token...");
    const supaBearer = await CheckSupabaseForToken();

    if (supaBearer) {
      console.log("Supabase Bearer found!");
      // Check if the current date is greater than the stored expiration time
      if (new Date() > supaBearer.expiration) {
        console.log(
          "Current Date is newer than Supabase Bearer expiration date."
        );
        console.log("Fetching a new Token...");
        return await fetchNewToken();
      }
      // If it's all groovy, go ahead:
      cachedToken = supaBearer.string;
      tokenExpirationTime = supaBearer.expiration;
    } else {
      console.log(
        "There was no result in the database, so we're trying to fetch a new token:"
      );
      console.log("Calling fetchNewToken...");
      return await fetchNewToken();
    }
  }

  // If there's a token currently in storage, move to this:
  console.log("(Line 160) Validating Supabase Bearer...");
  const isValid = await validateToken();
  if (!isValid) {
    console.log("Token is invalid, fetching new token...");
    return await fetchNewToken();
  }
  console.log("Validity check passed. Returning cachedToken...");
  return cachedToken;
}

// --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- --- Get solely the Token Expiration --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- ---
export async function getExpirationTime() {
  console.log("getExpiration called, its ,", tokenExpirationTime);
  console.log({ tokenExpirationTime });
  return tokenExpirationTime?.toString();
}

// --- --- --- --- --- --- --- --- --- --- --- --- ---
// --- --- --- --- Main GET endpoint --- --- --- ---
// --- --- --- --- --- --- --- --- --- --- --- --- ---
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
