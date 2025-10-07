import { showAlert } from '../../utilities/alert.js';
import { API_SOCIAL_PROFILES } from '../constants.js';
import { headers } from '../headers.js';
import { onFollowToggle } from './follow.js';

/**
 * Fetches and renders the user profile including profile details, posts, and follow status.
 */
(async function renderProfile() {
  const authorContainer = document.getElementById('authorContainer');
  authorContainer.classList.add('loading');

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (!username) {
      throw new Error('No username provided in URL.');
    }

    const response = await fetch(
      `${API_SOCIAL_PROFILES}/${username}?_posts=true&_followers=true&_following=true`,
      { headers: headers(true) }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch profile.');
    }

    const profileData = await response.json();

    const {
      name = 'Unknown',
      bio = 'No bio available',
      avatar,
      posts = [],
      _count = {},
    } = profileData.data || {};
    const avatarUrl = avatar?.url || 'https://via.placeholder.com/150';

    authorContainer.classList.remove('loading');
    document.getElementById('authorAvatar').src = avatarUrl;
    document.getElementById('authorName').textContent = name;
    document.getElementById('authorBio').textContent = bio;

    document.getElementById('postCount').textContent = _count.posts || 0;
    document.getElementById('followerCount').textContent = _count.followers || 0;
    document.getElementById('followingCount').textContent = _count.following || 0;

    // Render posts
    const authorPosts = document.getElementById('authorPosts');
    if (posts.length === 0) {
      authorPosts.innerHTML = '<p>No posts to display.</p>';
    } else {
      authorPosts.innerHTML = posts
        .map(
          (post) => `
          <div class="post">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <small>Posted on: ${new Date(post.created).toLocaleDateString()}</small>
          </div>`
        )
        .join('');
    }

    const followButton = document.getElementById('followButton');
    let isFollowing = profileData.data.followers?.some(
      (follower) => follower.name === localStorage.getItem('username')
    );

    followButton.textContent = isFollowing ? 'Unfollow' : 'Follow';

    followButton.addEventListener('click', async () => {
      followButton.disabled = true;
      try {
        const newFollowStatus = await onFollowToggle(username, isFollowing);
        followButton.textContent = newFollowStatus ? 'Unfollow' : 'Follow';
        isFollowing = newFollowStatus;
      } catch {
        showAlert('Failed to update follow status. Please try again.', 'error');
      } finally {
        followButton.disabled = false;
      }
    });
  } catch {
    authorContainer.innerHTML = `<p class="error">Failed to load user profile. Please try again later.</p>`;
  } finally {
    authorContainer.classList.remove('loading');
  }
})();
