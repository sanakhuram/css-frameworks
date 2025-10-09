import { readPosts } from '../../api/post/read.js';

/**
 * Fetches and renders posts in the feed.
 *
 * @param {number} [page=1] - Current page number.
 * @param {string} [sort="created"] - Sort field.
 * @param {string} [sortOrder="desc"] - Sort order.
 * @param {string} [query=""] - Optional search query.
 */
export async function renderPosts(page = 1, sort = "created", sortOrder = "desc", query = "") {
  const postFeed = document.getElementById("postFeed");
  const paginationContainer = document.getElementById("pagination");

  // Loading spinner
  postFeed.innerHTML = `
    <div class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500 border-solid"></div>
    </div>
  `;

  try {
    const { data: postsData, meta } = await readPosts(
      16,
      page,
      query,
      sort,
      sortOrder,
      true, // _author
      true, // _comments
      true  // _reactions
    );

    if (!postsData?.length) {
      postFeed.innerHTML = `<p class="text-center text-gray-600 mt-4">No posts match your search criteria.</p>`;
      paginationContainer.innerHTML = "";
      return;
    }

    // Flexible grid for 4+ cards per row
    postFeed.className = "grid gap-8 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] w-full";

    postFeed.innerHTML = postsData
      .map(post => `
        <a href="/post/?id=${post.id}" class="w-full bg-gradient-to-br bg-white rounded-lg border border-gray-300 dark:border-gray-600 shadow hover:shadow-md hover:scale-105 transition-all overflow-hidden flex flex-col">
          
          <!-- Author -->
          <div class="flex items-center gap-2 px-2 py-1">
            <img src="${post.author?.avatar?.url || '/images/placeholder.jpg'}" alt="${post.author?.name || 'Author'}" class="w-5 h-5 rounded-full object-cover">
            <span class="text-xs font-medium text-gray-900 truncate">${post.author?.name || 'Unknown'}</span>
          </div>

          <!-- Title & Body -->
          <div class="px-2 pb-1 flex-1 flex flex-col">
            <h2 class="text-sm font-semibold text-gray-900 truncate">${post.title || 'Untitled'}</h2>
            <p class="text-[10px] text-gray-800  mt-1 line-clamp-2">${post.body || 'No content available'}</p>
          </div>

          <!-- Square Image -->
          <div class="p-2">
            <img
              src="${post.media?.url && isValidImage(post.media.url) ? post.media.url : '/images/placeholder.jpg'}"
              alt="${post.media?.alt || 'Post Image'}"
              onerror="this.src='/images/placeholder.jpg';"
              class="w-full aspect-square object-cover rounded-md"
            />
          </div>

          <!-- Tags, Comments & Reactions -->
          <div class="px-2 py-1 flex justify-between items-center text-[10px] text-gray-900">
            <span>Tags: ${post.tags?.length ? post.tags.join(', ') : 'No tags'}</span>
            <span>💬 ${post._count?.comments || 0} | ❤️ ${post._count?.reactions || 0}</span>
          </div>

          <!-- Date -->
          <div class="px-2 pb-1 text-[9px] text-gray-700  truncate">
            ${new Date(post.created).toLocaleDateString()}
          </div>

        </a>
      `).join('');

    // Pagination
    renderPagination(meta.totalPages || Math.ceil(meta.totalCount / 16), page, sort, sortOrder, query);

  } catch (error) {
    console.error("Error rendering posts:", error);
    postFeed.innerHTML = `<p class="text-center text-red-500 mt-4">An error occurred while loading posts.</p>`;
    paginationContainer.innerHTML = "";
  }
}

/**
 * Renders pagination controls.
 */
function renderPagination(totalPages, page, sort, sortOrder, query = '') {
  const paginationContainer = document.getElementById('pagination');

  paginationContainer.innerHTML = `
    <div class="flex justify-center items-center space-x-2 mt-4">
      <button id="prevPage" class="px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600 ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""}" ${page <= 1 ? "disabled" : ""}>Previous</button>
      <span class="text-gray-700 dark:text-white text-sm">Page ${page} of ${totalPages}</span>
      <button id="nextPage" class="px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600 ${page >= totalPages ? "opacity-50 cursor-not-allowed" : ""}" ${page >= totalPages ? "disabled" : ""}>Next</button>
    </div>
  `;

  document.getElementById("prevPage")?.addEventListener("click", () => {
    renderPosts(page - 1, sort, sortOrder, query);
  });

  document.getElementById('nextPage')?.addEventListener('click', () => {
    renderPosts(page + 1, sort, sortOrder, query);
  });
}

/**
 * Validates whether a URL is valid.
 *
 * @param {string} url
 * @returns {boolean} True if valid, false otherwise
 */
function isValidImage(url) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}
