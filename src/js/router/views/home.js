import { renderPosts } from '../../ui/post/renderPost.js';
import { authGuard } from '../../utilities/authGuard.js';

authGuard();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await renderPosts();
  } catch (error) {
    console.error('Error loading posts:', error);
  }
});
