import { fetchProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js";
import { showAlert } from "../../utilities/alert.js";

/**
 * Initializes the profile page by loading and rendering profile data.
 */
export async function initializeProfilePage() {
  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href = "/auth/login/";
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
    showAlert("Failed to load profile. Please try again later.", "error");
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

  setProfileCounts(profileData);
  renderUserPosts(profileData.posts || []);
}

/**
 * Updates the profile's followers and following counts with event listeners.
 * @param {Object} profileData - The profile data to display.
 */
function setProfileCounts(profileData) {
  const followerCountElement = document.getElementById("followerCount");
  const followingCountElement = document.getElementById("followingCount");

  followerCountElement.textContent = `Followers: ${profileData._count?.followers || 0}`;
  followingCountElement.textContent = `Following: ${profileData._count?.following || 0}`;

  const buttonClasses =
    "text-darkBlue bg-lightBlue py-1 px-3 rounded-md hover:bg-red hover:text-lightGray cursor-pointer dark:bg-darkBlue dark:text-white dark:hover:bg-red shadow-red-yellow";

  followerCountElement.className = buttonClasses;
  followingCountElement.className = buttonClasses;

  followerCountElement.addEventListener("click", () =>
    showModal("Followers", profileData.followers || []),
  );
  followingCountElement.addEventListener("click", () =>
    showModal("Following", profileData.following || []),
  );
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
  postContainer.innerHTML = `<p class="text-gray-600 text-center">Loading posts...</p>`;
}

/**
 * Renders the user's posts in a grid layout.
 * @param {Array} posts - Array of posts to render.
 */
function renderUserPosts(posts) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  if (posts.length === 0) {
    postContainer.innerHTML = `<p class="text-gray-600 text-center shadow-red-yellow">No posts to display.</p>`;
    return;
  }

  postContainer.className =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className =
      "bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col shadow-yellow-400";

    const postImage = post.media?.url
      ? `<img src="${post.media.url}" alt="${post.media.alt || "Post Image"}" class="w-full h-40 object-cover rounded-md mb-2">`
      : `<div class="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
          <span class="text-gray-500">No Image</span>
        </div>`;

    postElement.innerHTML = `
      ${postImage}
      <h3 class="text-lg font-semibold mb-2">${post.title}</h3>
      <p class="text-gray-700 mb-4 line-clamp-3">${post.body}</p>
      <small class="text-gray-500 mb-4">Posted on: ${new Date(post.created).toLocaleDateString()}</small>
      <a href="/post/?id=${post.id}" class="mt-auto text-red hover:underline">View Post</a>
    `;

    postContainer.appendChild(postElement);
  });
}

/**
 * Handles profile update form submission.
 * @param {Event} event - The form submission event.
 */
export async function onUpdateProfile(event) {
  event.preventDefault();

  const username = localStorage.getItem("username");
  if (!username) {
    showAlert("User not logged in. Redirecting to login.", "error");
    window.location.href = "/auth/login";
    return;
  }

  const updateButton = event.target.querySelector("button[type='submit']");
  updateButton.disabled = true;
  updateButton.textContent = "Updating...";

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

    showAlert("Profile updated successfully!", "success");
  } catch {
    showAlert("Error updating profile. Please try again.", "warning");
  } finally {
    updateButton.disabled = false;
    updateButton.textContent = "Update Profile";
  }
}

/**
 * Displays a modal with a list of items.
 * @param {string} title - The title of the modal.
 * @param {Array} items - The list of items to display.
 */
function showModal(title, items) {
  const existingModal = document.querySelector(".modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center";

  modal.innerHTML = `
    <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
      <h2 class="text-2xl font-bold mb-4">${title}</h2>
      <ul class="space-y-4">${items
        .map(
          (user) => `
        <li class="flex items-center mb-2">
          <img src="${user.avatar?.url || "/images/default-avatar.png"}" alt="${user.name || "User Avatar"}" class="w-10 h-10 rounded-full mr-2"/>
          <span>${user.name || "Unnamed User"}</span>
        </li>
      `,
        )
        .join("")}</ul>
      <button class="absolute top-4 right-4 text-gray-500 hover:text-red">&times;</button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("button").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.remove();
  });
}
