/**
 * Retrieves the token from localStorage.
 * @returns {string|null} The token if it exists, or null if it doesn't.
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Stores a token in localStorage.
 * @param {string} token - The token to be stored.
 */
export function setToken(token) {
  localStorage.setItem('token', token);
}

/**
 * Clears the token from localStorage.
 */
export function clearToken() {
  localStorage.removeItem('token');
}
