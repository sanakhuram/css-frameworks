import { authGuard } from "../../utilities/authGuard.js";
import { loadPostData, onUpdatePost } from "../../ui/post/update.js";

authGuard();

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editPostForm");
  const postId = new URLSearchParams(window.location.search).get("id");

  if (!form || !postId) {
    console.error("Edit post form or post ID not found");
    return;
  }

  form.dataset.postId = postId;

  await loadPostData(postId);

  form.addEventListener("submit", onUpdatePost);
});
