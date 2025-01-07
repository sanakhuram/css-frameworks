/**
 * Validates a URL to ensure it's valid and publicly accessible.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if valid, otherwise false.
 */
export function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

/**
 * Checks and retrieves the authentication token.
 * @returns {string} - The token if available.
 * @throws {Error} - If the token is missing.
 */
export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Token is missing.");
  }
  return token;
}

/**
 * Ensures that a username is provided.
 * @param {string} username - The username to check.
 * @throws {Error} - If the username is missing.
 */
export function validateUsername(username) {
  if (!username) {
    throw new Error("Username is required for this operation.");
  }
}
