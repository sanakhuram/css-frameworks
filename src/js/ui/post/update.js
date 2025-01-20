import { updatePost } from "../../api/post/update.js";
import { getPostById } from "../../api/post/get.js";
import { showAlert } from "../../utilities/alert.js";

/**
 * Utility function to get form field value with optional trimming and fallback.
 * @param {string} fieldId - The ID of the form field.
 * @returns {string} The trimmed value of the field or an empty string if not found.
 */
function getFormFieldValue(fieldId) {
  return document.getElementById(fieldId)?.value.trim() || "";
}

/**
 * Loads and populates the form with the current post data based on the post ID.
 * @param {string} postId - The ID of the post to fetch and display.
 */
export async function loadPostData(postId) {
  try {
    const postData = await getPostById(postId);
    const data = postData.data || postData;

    document.getElementById("editPostTitleForm").value = data.title || "";
    document.getElementById("editPostContentForm").value = data.body || "";
    document.getElementById("editImageURL").value = data.media?.url || "";
    document.getElementById("editImageAltText").value = data.media?.alt || "";
    document.getElementById("editTagsInput").value = (data.tags || []).join(
      ", ",
    );
  } catch {
    showAlert("Could not load the post data for editing.", "error");
  }
}

/**
 * Handles the form submission to update the post.
 * @param {Event} event - The form submission event.
 */
export async function onUpdatePost(event) {
  event.preventDefault();

  const postId = event.target.dataset.postId;
  if (!postId) {
    showAlert("Failed to update post: Missing post ID", "error");
    return;
  }

  const postData = {
    title: getFormFieldValue("editPostTitleForm"),
    body: getFormFieldValue("editPostContentForm"),
    media: getFormFieldValue("editImageURL")
      ? {
          url: getFormFieldValue("editImageURL"),
          alt: getFormFieldValue("editImageAltText"),
        }
      : undefined,
    tags: getFormFieldValue("editTagsInput")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };

  try {
    const updatedPost = await updatePost(postId, postData);
    if (updatedPost) {
      showAlert("Post updated successfully!", "success");
      window.location.href = `/post/?id=${postId}`;
    }
  } catch (error) {
    showAlert(
      "Failed to update post: " + (error.message || "Unknown error"),
      "error",
    );
  }
}
