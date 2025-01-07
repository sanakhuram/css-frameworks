import { API_SOCIAL_POSTS } from "../../api/constants.js";
import { headers } from "../../api/headers.js";
import { getLoggedInUser } from "../../api/auth.js";
import { handleDeletePost } from "./delete.js";
import { postComment, toggleReaction } from "../../api/post/postActions.js";

/**
 * Utility function to disable/enable buttons and update text.
 *
 * @param {HTMLButtonElement} button - The button element to toggle.
 * @param {boolean} isProcessing - Whether the button is in a processing state.
 * @param {string} processingText - The text to display when processing.
 * @param {string} defaultText - The default text for the button.
 */
function toggleButtonState(button, isProcessing, processingText, defaultText) {
  button.disabled = isProcessing;
  button.textContent = isProcessing ? processingText : defaultText;
}

/**
 * Utility function to calculate total reactions.
 *
 * @param {Array} reactions - The array of reactions for the post.
 * @returns {number} - Total number of reactions.
 */
function calculateTotalReactions(reactions = []) {
  return reactions.reduce((sum, reaction) => sum + reaction.count, 0);
}

/**
 * Utility function to render comments as HTML.
 *
 * @param {Array} comments - The array of comments for the post.
 * @returns {string} - HTML string for the comments section.
 */
function renderComments(comments = []) {
  return (
    comments
      .map(
        (comment) => `
      <div class="comment">
        <p><strong>${comment.owner || "Anonymous"}:</strong> ${comment.body}</p>
        <small>Posted on: ${new Date(comment.created).toLocaleString()}</small>
      </div>`,
      )
      .join("") || "<p>No comments available</p>"
  );
}

/**
 * Handles comment form submission.
 *
 * @param {Event} event - The form submission event.
 * @param {string} postId - The ID of the post being commented on.
 */
async function handleCommentSubmission(event, postId) {
  event.preventDefault();
  const commentText = document.getElementById("commentText").value.trim();

  if (!commentText) {
    alert("Please enter a comment.");
    return;
  }

  const submitButton = event.target.querySelector("button[type='submit']");
  toggleButtonState(submitButton, true, "Submitting...", "Submit");

  try {
    await postComment(postId, commentText);
    renderSinglePost();
  } catch (error) {
    alert("Error posting comment. Please try again.");
  } finally {
    toggleButtonState(submitButton, false, "Submitting...", "Submit");
  }
}

/**
 * Handles toggling reactions (like) for a post.
 *
 * @param {string} postId - The ID of the post being reacted to.
 */
async function handleReactionToggle(postId) {
  const likeButton = document.getElementById("likeButton");
  toggleButtonState(likeButton, true, "Processing...", "👍");

  try {
    const updatedReactions = await toggleReaction(postId, "👍");
    const totalReactions = calculateTotalReactions(
      updatedReactions.data.reactions,
    );
    document.getElementById("likeCount").textContent =
      `${totalReactions} Likes`;
  } catch (error) {
    console.error("Error toggling reaction:", error);
    alert("Error toggling reaction. Please try again.");
  } finally {
    toggleButtonState(likeButton, false, "Processing...", "👍");
  }
}

/**
 * Renders a single post on the page.
 *
 * @async
 * @function renderSinglePost
 * @throws Will throw an error if the post data cannot be fetched.
 */
export async function renderSinglePost() {
  const singlePostContainer = document.getElementById("singlePostContainer");
  if (!singlePostContainer) return;

  singlePostContainer.innerHTML = "<p>Loading post data...</p>";

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    singlePostContainer.innerHTML =
      "<p>Post ID not found. Please select a post.</p>";
    return;
  }

  try {
    const response = await fetch(
      `${API_SOCIAL_POSTS}/${postId}?_author=true&_comments=true&_reactions=true`,
      { method: "GET", headers: headers() },
    );
    if (!response.ok) throw new Error("Failed to fetch post data.");

    const { data: post } = await response.json();

    const user = getLoggedInUser();
    const isAuthor = post.author?.name === user?.username;
    const tags = post.tags?.length ? post.tags.join(", ") : "No tags";
    const commentsHTML = renderComments(post.comments);
    const reactionsCount = calculateTotalReactions(post.reactions);

    const authorLink = `
      <a href="/profile/userprofile?username=${post.author?.name}">
        ${post.author?.name || "Unknown Author"}
      </a>
    `;

    const postActions = isAuthor
      ? `<div class="post-actions">
        <button onclick="location.href='/post/edit/?id=${post.id}'">Edit</button>
        <button id="deletePostButton">Delete</button>
        </div>`
      : "";

    singlePostContainer.innerHTML = `
      <article id="post-${post.id}" class="post">
        <h1>${post.title || "Untitled Post"}</h1>
        <p>${post.body || "No content available"}</p>
        <img src="${
          post.media?.url || "/images/default-image.jpg"
        }" alt="Post Image">
        <p><strong>Tags:</strong> ${tags}</p>
        <p><strong>Author:</strong> ${authorLink}</p>
        <h3>Comments:</h3>
        <div id="commentsSection">${commentsHTML}</div>
        <form id="commentForm">
          <textarea id="commentText" placeholder="Add a comment..."></textarea>
          <button type="submit">Submit</button>
        </form>
        <h3>Reactions:</h3>
        <p id="likeCount">${reactionsCount} Likes</p>
        <button id="likeButton">👍</button>
        ${postActions}
      </article>
    `;

    if (isAuthor) {
      document
        .getElementById("deletePostButton")
        .addEventListener("click", async () => {
          try {
            await handleDeletePost(post.id);
            alert("Post deleted successfully.");
            window.location.href = "/";
          } catch (error) {
            alert("Failed to delete post.");
          }
        });
    }

    document
      .getElementById("commentForm")
      .addEventListener("submit", (event) =>
        handleCommentSubmission(event, postId),
      );

    document
      .getElementById("likeButton")
      .addEventListener("click", () => handleReactionToggle(postId));
  } catch (error) {
    console.error("Error rendering single post:", error);
    singlePostContainer.innerHTML = `
      <p>An error occurred while loading the post. Please try again later.</p>
      <button onclick="location.reload()">Retry</button>
    `;
  }
}
