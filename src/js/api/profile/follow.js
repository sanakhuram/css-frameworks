import { API_SOCIAL_PROFILES } from '../constants.js';
import { headers } from '../headers.js';
import { getAuthToken } from '../utils.js';

/**
 * Sends a request to follow a user.
 * @param {string} username - The username to follow.
 * @returns {Promise<boolean>} - Resolves to true if successfully followed.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function followUser(username) {
  const token = getAuthToken();
  const url = `${API_SOCIAL_PROFILES}/${username}/follow`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers(true, token),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to follow the user.');
  }

  return true;
}

/**
 * Sends a request to unfollow a user.
 * @param {string} username - The username of the profile to unfollow.
 * @returns {Promise<boolean>} - Resolves to false if successfully unfollowed.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function unfollowUser(username) {
  const token = getAuthToken();
  const url = `${API_SOCIAL_PROFILES}/${username}/unfollow`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers(true, token),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to unfollow the user.');
  }

  return false;
}

/**
 * Toggles the follow status of a user.
 * @param {string} username - The username of the profile to toggle follow status.
 * @param {boolean} isCurrentlyFollowing - Indicates whether the user is currently being followed.
 * @returns {Promise<boolean>} - Resolves to true if now following, otherwise false.
 */
export async function onFollowToggle(username, isCurrentlyFollowing) {
  return isCurrentlyFollowing ? await unfollowUser(username) : await followUser(username);
}
