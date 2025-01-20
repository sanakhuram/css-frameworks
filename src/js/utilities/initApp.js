// src/init.js

import { logout } from '../api/auth.js';
import { onLogin } from '../ui/auth/login.js';
import { onRegister } from '../ui/auth/register.js';
import {
  initializeProfilePage,
  onUpdateProfile,
} from '../ui/profile/update.js';
import { onCreatePost } from '../ui/post/create.js';
import { renderPosts } from '../ui/post/renderPost.js';
import { renderSinglePost } from '../ui/post/renderSinglePost.js';
import { loadPostData, onUpdatePost } from '../ui/post/update.js';
import { renderUserProfile } from '../ui/profile/userProfile.js';
import { showSpinner, hideSpinner } from '../utilities/spinner.js';
import { initializeThemeToggle } from '../utilities/theme';
import { showAlert } from './alert.js';

/**
 * Utility function to safely attach event listeners.
 * @param {string} selector - Selector for the target element.
 * @param {string} event - Event type.
 * @param {Function} handler - Event handler function.
 */
function attachEventListener(selector, event, handler) {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener(event, handler);
  }
}

export async function initializeApp() {
  try {
    showSpinner();

    initializeThemeToggle();

    attachEventListener("form[name='register']", 'submit', onRegister);

    attachEventListener("form[name='login']", 'submit', onLogin);

    attachEventListener('#logoutBtn', 'click', logout);

    attachEventListener('#createPostForm', 'submit', onCreatePost);

    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
      await initializeProfilePage();
      updateProfileForm.addEventListener('submit', onUpdateProfile);
    }

    const postFeed = document.getElementById('postFeed');
    if (postFeed) {
      try {
        await renderPosts();
      } catch (error) {
        console.error('Error loading posts:', error);
        showAlert('Error loading posts. Please try again later.', 'error');
      }
    }

    const userProfilePage = document.getElementById('authorContainer');
    if (userProfilePage) {
      try {
        await renderUserProfile();
      } catch (error) {
        console.error('Error rendering user profile:', error);
        showAlert('Error rendering user profile. Please try again later.', 'error');
      }
    }

    const singlePostContainer = document.getElementById('singlePostContainer');
    if (singlePostContainer) {
      renderSinglePost();
    }

    const editPostForm = document.getElementById('editPostForm');
    if (editPostForm) {
      const postId = new URLSearchParams(window.location.search).get('id');
      if (postId) {
        try {
          await loadPostData(postId);
          editPostForm.dataset.postId = postId;
          editPostForm.addEventListener('submit', onUpdatePost);
        } catch (error) {
          console.error('Error loading post data for editing:', error);
          showAlert('Error loading post data for editing. Please try again.', 'error');
        }
      } else {
        showAlert('No post ID found. Cannot load post for editing.', 'warning');
      }
    }

    attachEventListener('#searchButton', 'click', () => {
      showSpinner();
      const query = document.getElementById('searchQuery').value.trim();
      if (query) {
        renderPosts(1, 'created', 'desc', query).finally(() => hideSpinner());
      } else {
        showAlert('Please enter a search term.', 'error');
        hideSpinner();
      }
    });

    attachEventListener('#applySort', 'click', () => {
      showSpinner();
      const sortOrder = document.getElementById('sortOrder').value;
      renderPosts(1, 'created', sortOrder).finally(() => hideSpinner());
    });

    hideSpinner();
  } catch (error) {
    console.error('Error initializing application:', error);
    showAlert(
      'An error occurred while initializing the application. Please try again.', 'error'
    );
    hideSpinner();
  }
}