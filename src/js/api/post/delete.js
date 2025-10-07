import { getToken } from '../../utilities/token.js';
import { API_KEY, API_SOCIAL_POSTS } from '../constants.js';
import { headers } from '../headers.js';

/**
 * Deletes a post by ID from the API.
 * @param {string} id - The ID of the post to delete.
 * @returns {Object} - Returns an object with success status and an optional error message.
 */
export async function deletePost(id) {
  const apiUrl = `${API_SOCIAL_POSTS}/${id}`;

  try {
    const token = getToken();
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete post with ID: ${id}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
