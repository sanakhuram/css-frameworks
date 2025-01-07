import { API_AUTH_LOGIN } from "../constants";

/**
 * Sends a login request to the API and handles the response.
 * @param {Object} credentials - An object containing the user's credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Object} - Returns the user's data if login is successful.
 * @throws {Error} - Throws an error if the login request fails.
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const result = await response.json();

    localStorage.setItem("username", result.data.name);
    localStorage.setItem("token", result.data.accessToken);

    return result.data;
  } catch (error) {
    console.error("Error in login API:", error);
    throw error;
  }
}
