import { createPost } from '../../api/post/create.js';
import { showAlert } from '../../utilities/alert.js';

/**
 * Handles the creation of a new post.
 * Gathers form data, formats it into the required structure, and sends it to the API.
 *
 * @param {Event} event - The submit event triggered by the form.
 */
export async function onCreatePost(event) {
  event.preventDefault();

  const title = document.getElementById('postTitleForm')?.value.trim() || '';
  const content = document.getElementById('postContentForm')?.value.trim() || '';
  const imageUrl = document.getElementById('imageURL')?.value.trim() || '';
  const imageAlt = document.getElementById('imageAltText')?.value.trim() || '';
  const tagsInput = document.getElementById('tagsInput')?.value.trim() || '';

  const submitButton = event.target.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = 'Posting...';

  // Validate Required Fields
  if (!title || !content) {
    showAlert('Title and content are required to create a post.', 'warning');
    submitButton.disabled = false;
    submitButton.textContent = 'Create Post';
    return;
  }

  const tags = tagsInput
    ? tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const postData = {
    title,
    body: content,
    media: imageUrl ? { url: imageUrl, alt: imageAlt } : undefined,
    tags,
  };

  try {
    const response = await createPost(postData);
    if (response) {
      showAlert('Post created successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    showAlert('Failed to create post: ' + (error.message || 'Unknown error'), 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Create Post';
  }
}
