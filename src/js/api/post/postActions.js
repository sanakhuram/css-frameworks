import { API_SOCIAL_POSTS } from "../../api/constants.js";
import { headers } from "../../api/headers.js";

/**
 * Posts a comment to a specific post by its ID.
 *
 * @param {string} postId - The ID of the post to comment on.
 * @param {string} body - The text content of the comment to be posted.
 * @param {string} [replyToId] - Optional ID of the comment being replied to.
 * @returns {Promise<Object>} - A promise that resolves to the data of the posted comment.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function postComment(postId, body, replyToId = null) {
  const response = await fetch(`${API_SOCIAL_POSTS}/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ body, replyToId }),
    headers: headers("application/json"),
  });

  if (response.ok) {
    return await response.json();
  }

  const errorText = await response.text();
  throw new Error(`Error posting comment: ${response.statusText}`);
}

/**
 * Toggles a reaction (like 👍) for a specific post by its ID.
 *
 * @param {string} postId - The ID of the post to toggle a reaction on.
 * @param {string} symbol - The symbol representing the reaction.
 * @returns {Promise<Object>} - A promise that resolves to updated reaction data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function toggleReaction(postId, symbol) {
  try {
    const response = await fetch(
      `${API_SOCIAL_POSTS}/${postId}/react/${encodeURIComponent(symbol)}`,
      {
        method: "PUT",
        headers: headers(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to toggle reaction: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error toggling reaction: ${error.message}`);
  }
}
