import { API_SOCIAL_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { isValidUrl, getAuthToken } from "../utils.js";

/**
 * Updates a user's profile data on the API.
 * @param {string} username - The username to update profile data for.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} - The updated profile data.
 */
export async function updateProfile(username, profileData) {
  const token = getAuthToken();

  if (profileData.avatar && !isValidUrl(profileData.avatar)) {
    throw new Error(
      "Invalid avatar URL. Ensure it is valid and publicly accessible.",
    );
  }

  const payload = {
    bio: profileData.bio || "",
    avatar: { url: profileData.avatar || "", alt: "User avatar" },
  };

  const apiUrl = `${API_SOCIAL_PROFILES}/${username}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: headers(true, token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update profile: ${errorData.message || response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
