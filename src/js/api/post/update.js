import { getToken } from "../../utilities/token.js";
import { API_KEY, API_SOCIAL_POSTS } from "../../api/constants.js";
import { headers } from "../../api/headers.js";

/**
 * Updates a post by its ID.
 *
 * @param {string} id - The ID of the post to update.
 * @param {Object} data - The updated post data.
 * @param {string} data.title - The new post title.
 * @param {string} data.body - The updated post content.
 * @param {Array<string>} data.tags - Tags for the post.
 * @param {Object} data.media - Media details.
 * @param {string} data.media.url - Media URL.
 * @param {string} data.media.alt - Media alt text.
 *
 * @returns {Promise<Object>} - Resolves with the updated post data.
 * @throws {Error} - If the user is unauthenticated or the update fails.
 */
export async function updatePost(id, { title, body, tags, media }) {
  const token = getToken();
  if (!token) {
    throw new Error("User is not authenticated. Missing token.");
  }

  const postData = {
    title,
    body,
    tags,
    media: { url: media.url, alt: media.alt },
  };

  try {
    const response = await fetch(`${API_SOCIAL_POSTS}/${id}`, {
      method: "PUT",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update post: ${
          errorData.errors?.[0]?.message || response.statusText
        }`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error updating post: ${error.message}`);
  }
}
