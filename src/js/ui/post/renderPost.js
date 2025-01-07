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
  query = "",
) {
  const postFeed = document.getElementById("postFeed");
  const paginationContainer = document.getElementById("pagination");

  postFeed.innerHTML = "<p>Loading posts...</p>";

  try {
    const { data: postsData, meta } = await readPosts(
      12,
      page,
      query,
      sort,
      sortOrder,
    );

    if (postsData?.length) {
      const postsHTML = postsData
        .map(
          (post) => `
          <a href="/post/?id=${post.id}" class="post-link">
            <article id="post-${post.id}" class="post">
              <h2>${post.title || "Untitled"}</h2>
              <p>${post.body || "No content available"}</p>
              <img src="${
                post.media?.url && isValidImage(post.media.url)
                  ? post.media.url
                  : "/images/placeholder.jpg"
              }" 
                alt="${post.media?.alt || "Post Image"}"
                onerror="this.src='/images/placeholder.jpg';">
              <p>Tags: ${post.tags?.join(", ") || "No tags"}</p>
            </article>
          </a>
        `,
        )
        .join("");

      postFeed.innerHTML = postsHTML;

      renderPagination(
        meta.totalPages || Math.ceil(meta.totalCount / 12),
        page,
        sort,
        sortOrder,
        query,
      );
    } else {
      postFeed.innerHTML = "<p>No posts match your search criteria.</p>";
      paginationContainer.innerHTML = "";
    }
  } catch (error) {
    console.error("Error rendering posts:", error);
    postFeed.innerHTML = "<p>An error occurred while loading posts.</p>";
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

  paginationContainer.innerHTML = `
    <button id="prevPage" ${page <= 1 ? "disabled" : ""}>Previous</button>
    <span>Page ${page} of ${totalPages}</span>
    <button id="nextPage" ${page >= totalPages ? "disabled" : ""}>Next</button>
  `;

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
