import { API_SOCIAL_POSTS } from '../../api/constants.js';
import { headers } from '../../api/headers.js';

/**
 * Fetches posts from the API, with support for searching by title or body.
 *
 * @param {number} [limit=12] - Number of posts to fetch per page.
 * @param {number} [page=1] - The page number to fetch.
 * @param {string} [query=""] - Search query for title or body.
 * @param {string} [sort="created"] - The field to sort posts by.
 * @param {string} [sortOrder="desc"] - The sort order ("asc" or "desc").
 *
 * @returns {Promise<Object>} API response containing posts and metadata.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function readPosts(
  limit = 12,
  page = 1,
  query = '',
  sort = 'created',
  sortOrder = 'desc'
) {
  const queryParams = new URLSearchParams({
    _author: true,
    _comments: true,
    _reactions: true,
    limit,
    page,
    sort,
    sortOrder,
    ...(query && { q: query }),
  });

  const endpoint = query ? `${API_SOCIAL_POSTS}/search` : API_SOCIAL_POSTS;

  try {
    const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
}
