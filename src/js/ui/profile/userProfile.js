import { API_SOCIAL_PROFILES } from "../../api/constants.js";
import { headers } from "../../api/headers.js";
import { onFollowToggle } from "../../api/profile/follow.js";

/**
 * Fetch and render the user's profile and posts.
 */
export async function renderUserProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  if (!username) {
    document.getElementById("authorContainer").innerHTML =
      "<p>Error: No username provided.</p>";
    return;
  }

  try {
    const response = await fetch(
      `${API_SOCIAL_PROFILES}/${username}?_posts=true&_followers=true&_following=true`,
      { headers: headers(true) },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const profileData = await response.json();
    const { name, bio, avatar, _count, followers, posts } = profileData.data;

    document.getElementById("authorAvatar").src =
      avatar?.url || "https://via.placeholder.com/150";
    document.getElementById("authorName").textContent = name || "Unknown User";
    document.getElementById("authorBio").textContent =
      bio || "No bio available";

    document.getElementById("postCount").textContent = _count?.posts || 0;
    document.getElementById("followerCount").textContent =
      _count?.followers || 0;
    document.getElementById("followingCount").textContent =
      _count?.following || 0;

    renderUserPosts(posts);

    setupFollowButton(username, followers);
  } catch {
    document.getElementById("authorContainer").innerHTML =
      "<p>Error loading user profile. Please try again later.</p>";
  }
}

/**
 * Sets up the follow/unfollow button functionality.
 * @param {string} username - The username of the profile.
 * @param {Array} followers - The list of current followers.
 */
function setupFollowButton(username, followers) {
  const followButton = document.getElementById("followButton");
  let isCurrentlyFollowing = followers.some(
    (follower) => follower.name === localStorage.getItem("username"),
  );

  followButton.textContent = isCurrentlyFollowing ? "Unfollow" : "Follow";

  followButton.addEventListener("click", async () => {
    followButton.disabled = true;
    const originalText = followButton.textContent;
    followButton.textContent = isCurrentlyFollowing
      ? "Unfollowing..."
      : "Following...";

    try {
      const newFollowStatus = await onFollowToggle(
        username,
        isCurrentlyFollowing,
      );
      isCurrentlyFollowing = newFollowStatus;
      followButton.textContent = newFollowStatus ? "Unfollow" : "Follow";

      const currentFollowerCount = parseInt(
        document.getElementById("followerCount").textContent,
        10,
      );
      document.getElementById("followerCount").textContent = newFollowStatus
        ? currentFollowerCount + 1
        : currentFollowerCount - 1;
    } catch {
      alert("Failed to update follow status. Please try again.");
      followButton.textContent = originalText;
    } finally {
      followButton.disabled = false;
    }
  });
}

/**
 * Renders posts on the user profile page and makes them clickable.
 * @param {Array} posts - Array of posts to render.
 */
function renderUserPosts(posts) {
  const authorPosts = document.getElementById("authorPosts");
  authorPosts.innerHTML = "";
authorPosts.classList.add("grid", "grid-cols-1", "sm:grid-cols-3", "lg:grid-cols-30", "gap-4", "p-4")
  if (!posts || posts.length === 0) {
    authorPosts.innerHTML = "<p class='test-gray-500'>No posts to display.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post", "bg-lightGray", "p-4", "rounded", "shadow", "hover:bg-slate-300", "transition");

    const postImage = post.media?.url
      ? `<img src="${post.media.url}" alt="${
          post.media.alt || "Post Image"
        }" class="post-image" w-full h-40 object-cover rounded mb-4>`
      : `<img src="https://via.placeholder.com/150" alt="Placeholder Image" class="post-image w-full h-40 object-cover rounded mb-4">`;

    postElement.innerHTML = `
      <a href="/post/?id=${post.id}" class="post-link text-darkBlue hover:underline">
        ${postImage}
        <h3 class="text-lg font-bold mb-2">${post.title}</h3>
        <p class="text-sm text-gray-700 mb-2">${post.body}</p>
        <small class="text-xs text-gray-500">Posted on: ${new Date(post.created).toLocaleDateString()}</small>
      </a>
    `;

    authorPosts.appendChild(postElement);
  });
}
