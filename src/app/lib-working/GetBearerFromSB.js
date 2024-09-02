"use server";

import { db } from "./db";

// Get existing bearer from database
export default async function GetBearerFromSB() {
  console.log("(GetBearerFromSB log) Checking database for token.");

  try {
    const response = await db.query(
      `
    SELECT * FROM bearer WHERE id = 1;
    `
    );
    const result = response.rows[0];

    if (!result) {
      console.log(
        "(GetBearerFromSB log) Oops! No bearer token found in the database."
      );
      return null;
    }
    // Ensure expiration time is formatted correctly
    if (result.expiration) {
      result.expiration = new Date(result.expiration);
      console.log(
        "(GetBearerFromSB log) Expiration time formatted to Date object:",
        result.expiration
      );
    }

    console.log("(GetBearerFromSB log) Success!");
    return result;
  } catch (error) {
    console.error("Error retrieving bearer from Supabase:", error);
    throw error;
  }
}
