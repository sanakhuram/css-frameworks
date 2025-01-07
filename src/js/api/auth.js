/**
 * Logs out the user by clearing stored session data.
 */
export function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  alert("You have been logged out.");
  window.location.href = "/auth/login/";
}

/**
 * Retrieves the logged-in user's information from localStorage.
 * @returns {Object|null} An object containing username and token, or null if no user is logged in.
 */
export function getLoggedInUser() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  if (username && token) {
    return { username, token };
  }
  return null;
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
export function isUserLoggedIn() {
  return !!localStorage.getItem("token");
}

/**
 * Updates the user's information in localStorage.
 * @param {Object} updatedData - An object containing the updated user information.
 * @param {string} [updatedData.name] - The updated username.
 * @param {string} [updatedData.token] - The updated access token.
 */
export function updateUserInfo(updatedData) {
  if (updatedData.name) {
    localStorage.setItem("username", updatedData.name);
  }
  if (updatedData.token) {
    localStorage.setItem("token", updatedData.token);
  }
}
