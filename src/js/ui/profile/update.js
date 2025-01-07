import { fetchProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js";

/**
 * Initializes the profile page by loading and rendering profile data.
 */
export async function initializeProfilePage() {
  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href = "/auth/login";
    return;
  }

  try {
    clearProfileUI();

    let profileData = JSON.parse(localStorage.getItem("profileData"));
    if (!profileData || !profileData.name) {
      profileData = await fetchProfile(username);
      localStorage.setItem("profileData", JSON.stringify(profileData));
    }

    updateProfileUI(profileData);
  } catch {
    alert("Failed to load profile. Please try again later.");
  }
}

/**
 * Updates the profile UI with fetched data.
 * @param {Object} profileData - The profile data to display.
 */
function updateProfileUI(profileData) {
  document.getElementById("profileAvatar").src =
    profileData.avatar?.url || "/images/default-avatar.png";
  document.getElementById("profileName").textContent =
    profileData.name || "Your Name";
  document.getElementById("profileBio").textContent =
    profileData.bio || "Bio goes here...";

  document.getElementById("postCount").textContent = `Posts: ${
    profileData._count?.posts || 0
  }`;

  const followerCountElement = document.getElementById("followerCount");
  followerCountElement.textContent = `Followers: ${
    profileData._count?.followers || 0
  }`;

  const followingCountElement = document.getElementById("followingCount");
  followingCountElement.textContent = `Following: ${
    profileData._count?.following || 0
  }`;

  followerCountElement.addEventListener("click", () => {
    showModal(
      "Followers",
      profileData.followers || [],
      (user) => `
      <li style="display: flex; align-items: center; margin-bottom: 10px;">
        <img 
          src="${user.avatar?.url || "/images/default-avatar.png"}" 
          alt="${user.name || "User Avatar"}" 
          style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"
        />
        <span>${user.name || "Unnamed User"}</span>
      </li>
    `,
    );
  });

  followingCountElement.addEventListener("click", () => {
    showModal(
      "Following",
      profileData.following || [],
      (user) => `
      <li style="display: flex; align-items: center; margin-bottom: 10px;">
        <img 
          src="${user.avatar?.url || "/images/default-avatar.png"}" 
          alt="${user.name || "User Avatar"}" 
          style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"
        />
        <span>${user.name || "Unnamed User"}</span>
      </li>
    `,
    );
  });

  renderUserPosts(profileData.posts || []);
}

/**
 * Clears the profile UI to prevent stale data from being displayed.
 */
function clearProfileUI() {
  document.getElementById("profileAvatar").src = "/images/default-avatar.png";
  document.getElementById("profileName").textContent = "Your Name";
  document.getElementById("profileBio").textContent = "Bio goes here...";
  document.getElementById("postCount").textContent = "Posts: 0";
  document.getElementById("followerCount").textContent = "Followers: 0";
  document.getElementById("followingCount").textContent = "Following: 0";

  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "<p>Loading posts...</p>";
}

/**
 * Renders the user's posts in the profile page, including images if available,
 * and makes them clickable to navigate to the post page.
 * @param {Array} posts - Array of posts to render.
 */
function renderUserPosts(posts) {
  const postContainer = document.getElementById("postContainer");

  postContainer.innerHTML = "";

  if (posts.length === 0) {
    postContainer.innerHTML = "<p>No posts to display.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const postImage = post.media?.url
      ? `<img src="${post.media.url}" alt="${
          post.media.alt || "Post Image"
        }" class="post-image">`
      : "";

    postElement.innerHTML = `
      ${postImage}
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <small>Posted on: ${new Date(post.created).toLocaleDateString()}</small>
      <a href="/post/?id=${post.id}" class="view-post-link">View Post</a>
    `;

    postContainer.appendChild(postElement);
  });
}

/**
 * Handles profile update form submission, sends updated data to the server.
 * @param {Event} event - The form submission event.
 */
export async function onUpdateProfile(event) {
  event.preventDefault();

  const username = localStorage.getItem("username");
  if (!username) {
    alert("User not logged in. Redirecting to login.");
    window.location.href = "/auth/login";
    return;
  }

  const profileData = {
    avatar: document.getElementById("avatar").value || "",
    name: document.getElementById("name").value || "",
    bio: document.getElementById("bio").value || "",
  };

  try {
    await updateProfile(username, profileData);

    const updatedProfile = await fetchProfile(username);

    updateProfileUI(updatedProfile.data);

    localStorage.setItem("profileData", JSON.stringify(updatedProfile.data));

    alert("Profile updated successfully!");
  } catch {
    alert("Error updating profile. Please try again.");
  }
}

/**
 * Displays a modal with a list of items .
 * @param {string} title - The title of the modal.
 * @param {Array} items - The list of items to display.
 * @param {Function} itemRenderer - A function to render each item in the list.
 */
function showModal(title, items, itemRenderer) {
  const existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="modal-content">
      <h2>${title}</h2>
      <ul>
        ${items.map(itemRenderer).join("")}
      </ul>
      <button class="close-modal">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
