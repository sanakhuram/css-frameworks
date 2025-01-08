import { readPosts } from "../../api/post/read.js";

/**
 * Renders a paginated list of posts on the page.
 * Fetches posts from the API and displays them along with pagination controls.
 *
 * @param {number} [page=1] - The current page number to render.
 * @param {string} [sort="created"] - The field by which posts should be sorted.
 * @param {string} [sortOrder="desc"] - The order in which posts should be sorted (ascending or descending).
 */
export async function renderPosts(
  page = 1,
  sort = "created",
  sortOrder = "desc",
  query = ""
) {
  const postFeed = document.getElementById("postFeed");
  const paginationContainer = document.getElementById("pagination");

  // Show loading spinner
  postFeed.innerHTML = `
    <div class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500 border-solid"></div>
    </div>
  `;

  try {
    const { data: postsData, meta } = await readPosts(
      12,
      page,
      query,
      sort,
      sortOrder
    );

    if (postsData?.length) {
      const postsHTML = postsData
        .map(
          (post) => `
      <a href="/post/?id=${post.id}" class="block bg-white rounded-lg border border-gray-300 shadow hover:shadow-lg transition-all overflow-hidden">
        <article id="post-${post.id}" class="p-4 h-full flex flex-col">
          <div class="mb-4">
            <h2 class="text-lg font-bold text-darkBlue truncate">${post.title || 'Untitled'}</h2>
            <p class="text-sm text-gray-600 mt-2 line-clamp-2">${post.body || 'No content available'}</p>
          </div>
              <img
                src="${
                  post.media?.url && isValidImage(post.media.url)
                    ? post.media.url
                    : '/images/placeholder.jpg'
                }"
                alt="${post.media?.alt || 'Post Image'}"
                onerror="this.src='/images/placeholder.jpg';"
                class="mt-4 w-full h-40 object-cover rounded-md"
              >
              <p class="mt-2 text-sm text-gray-500">
                Tags: ${post.tags?.join(', ') || 'No tags'}
              </p>
            </article>
          </a>
        `
        )
        .join('');

      postFeed.innerHTML = postsHTML;

      renderPagination(
        meta.totalPages || Math.ceil(meta.totalCount / 12),
        page,
        sort,
        sortOrder,
        query
      );
    } else {
      postFeed.innerHTML = `
        <p class="text-center text-gray-600 mt-4">No posts match your search criteria.</p>
      `;
      paginationContainer.innerHTML = "";
    }
  } catch (error) {
    console.error("Error rendering posts:", error);
    postFeed.innerHTML = `
      <p class="text-center text-red-500 mt-4">An error occurred while loading posts.</p>
    `;
    paginationContainer.innerHTML = "";
  }
}

/**
 * Renders pagination controls for the post list.
 *
 * @param {number} totalPages - The total number of pages available.
 * @param {number} page - The current page number.
 * @param {string} sort - The field by which posts are sorted.
 * @param {string} sortOrder - The order in which posts are sorted (ascending or descending).
 */
function renderPagination(totalPages, page, sort, sortOrder, query = "") {
  const paginationContainer = document.getElementById("pagination");

  let paginationHTML = `
    <div class="flex justify-center items-center space-x-2 mt-4">
      <button id="prevPage" class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 ${
        page <= 1 ? "opacity-50 cursor-not-allowed" : ""
      }" ${page <= 1 ? "disabled" : ""}>
        Previous
      </button>
      <span class="text-gray-700">Page ${page} of ${totalPages}</span>
      <button id="nextPage" class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 ${
        page >= totalPages ? "opacity-50 cursor-not-allowed" : ""
      }" ${page >= totalPages ? "disabled" : ""}>
        Next
      </button>
    </div>
  `;

  paginationContainer.innerHTML = paginationHTML;

  document.getElementById("prevPage")?.addEventListener("click", () => {
    renderPosts(page - 1, sort, sortOrder, query);
  });

  document.getElementById("nextPage")?.addEventListener("click", () => {
    renderPosts(page + 1, sort, sortOrder, query);
  });
}

/**
 * Validates if the given URL is valid and accessible.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - Returns true if the URL is valid, otherwise false.
 */
function isValidImage(url) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}
