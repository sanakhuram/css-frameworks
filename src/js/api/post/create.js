import { API_SOCIAL_POSTS } from '../constants.js';
import { headers } from '../headers.js';

/**
 * Function to create a new post.
 * @param {Object} postData - The data of the post to be created.
 * @returns {Promise<Object>} The created post data.
 * @throws {Error} If the post creation fails.
 */
export async function createPost(postData) {
  try {
    const response = await fetch(API_SOCIAL_POSTS, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }

    return await response.json();
  } catch (error) {
    throw new Error('An error occurred while creating the post: ' + error.message);
  }
}
