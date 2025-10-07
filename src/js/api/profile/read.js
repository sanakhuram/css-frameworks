import { showAlert } from '../../utilities/alert.js';
import { API_SOCIAL_PROFILES } from '../constants.js';
import { headers } from '../headers.js';
import { getAuthToken, validateUsername } from '../utils.js';

/**
 * Fetches a user's profile data from the API.
 * @param {string} username - The username of the profile to retrieve.
 * @returns {Promise<Object>} - The profile data.
 * @throws {Error} - Throws an error if the API request fails or the username is invalid.
 */
export async function fetchProfile(username) {
  const token = getAuthToken();
  if (!token) {
    showAlert('Authentication token is missing. Redirecting to login...', 'error');
    window.location.href = '/auth/login';
    return;
  }

  validateUsername(username);

  const apiUrl = `${API_SOCIAL_PROFILES}/${username}?_posts=true&_followers=true&_following=true`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: headers(false, token),
  });

  if (!response.ok) {
    if (response.status === 401) {
      showAlert('Unauthorized. Redirecting to login...', 'error');
      window.location.href = '/auth/login';
      return;
    }
    const errorData = await response.json();
    throw new Error(`Failed to load profile: ${errorData.message || response.statusText}`);
  }

  return response.json();
}
