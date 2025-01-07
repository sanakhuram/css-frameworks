import { login } from "../../api/auth/login";

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
export async function onLogin(event) {
  event.preventDefault();
  const loginForm = event.target;
  const email = loginForm.querySelector("#email").value;
  const password = loginForm.querySelector("#password").value;

  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) errorMessage.style.display = "none";

  try {
    await login({ email, password });

    alert("Login successful! Redirecting to your profile...");
    window.location.href = "/profile/";
  } catch (error) {
    if (errorMessage) {
      errorMessage.innerText = `Login failed: ${error.message}`;
      errorMessage.style.display = "block";
    } else {
      alert(`Login failed: ${error.message}`);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form[name='login']");
  if (loginForm) loginForm.addEventListener("submit", onLogin);
});
