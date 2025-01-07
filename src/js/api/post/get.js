import { API_SOCIAL_POSTS } from "../../api/constants.js";
import { headers } from "../../api/headers.js";

/**
 * Fetches the details of a specific post by its ID from the Social API.
 *
 * @param {string} postId - The unique identifier of the post to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the post data retrieved from the API.
 * @throws {Error} Throws an error if the API request fails or the post is not found.
 */
export async function getPostById(postId) {
  try {
    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch post data");
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      "An error occurred while fetching post data: " + error.message,
    );
  }
}
