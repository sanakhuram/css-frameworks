import { authGuard } from '../../utilities/authGuard.js';
import { renderPosts } from '../../ui/post/renderPost.js';
import { getLoggedInUser } from '../../api/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = getLoggedInUser();

  if (!user) {
    window.location.href = '/auth/login/';
    return;
  }

  try {
    await renderPosts();
  } catch (error) {
    console.error('Error rendering posts:', error);
  }
});
