import { deletePost } from "../../api/post/delete.js";

/**
 * Handles deletion of a post and updates the UI.
 * @param {string} postId - The ID of the post to delete
 */
export async function handleDeletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const result = await deletePost(postId);

    if (result.success) {
      alert("Post deleted successfully!");
      document.getElementById(`post-${postId}`)?.remove();
    } else {
      alert(`Failed to delete post: ${result.message}`);
    }
  } catch {
    alert(
      "An error occurred while trying to delete the post. Please try again.",
    );
  }
}
