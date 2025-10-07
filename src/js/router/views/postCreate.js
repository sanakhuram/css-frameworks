import { onCreatePost } from '../../ui/post/create.js';
import { authGuard } from '../../utilities/authGuard.js';

authGuard();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createPostForm');
  if (form) {
    form.addEventListener('submit', onCreatePost);
  } else {
    console.error('Create post form not found');
  }
});
