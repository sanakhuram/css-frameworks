import { API_AUTH_REGISTER } from "../constants";

/**
 * Registers a new user by sending their details to the authentication API.
 *
 * @param {Object} userDetails - The user's registration details.
 * @param {string} userDetails.name - Username.
 * @param {string} userDetails.email - Email address.
 * @param {string} userDetails.password - Password.
 * @returns {Object} - Response data from the server.
 * @throws {Error} - If the API request fails.
 */
export async function register({ name, email, password }) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      return await response.json();
    }

    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  } catch (error) {
    console.error("Error during register API call:", error);
    throw error;
  }
}
