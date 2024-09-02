"use server";

import { db } from "./db";

// Insert new bearer into the database
export default async function UpdateBearerToSB(string, expiration) {
  console.log(
    "(UpdateBearerToSB log) Attempting to update bearer in database..."
  );

  // Ensure expiration is formatted in UTC, as an ISO string
  const expirationUTC = new Date(expiration).toISOString();

  try {
    const response = await db.query(
      `
      UPDATE bearer
      SET string = $1, expiration = $2
      WHERE id = 1
      RETURNING *`,
      [string, expirationUTC]
    );
    if (response.rows.length > 0) {
      const result = response.rows[0];
      console.log("(UpdateBearerToSB log) Successful update!");
      return;
    } else {
      throw new Error(
        "No rows updated, possible concurrency issue or incorrect ID."
      );
    }
  } catch (error) {
    console.error("Error updating bearer in the database:", error);
    throw error;
  }
}
