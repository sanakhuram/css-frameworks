import { login } from "../../api/auth/login";
import { showAlert } from "../../utilities/alert";

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
export async function onLogin(event) {
  event.preventDefault();

  const loginForm = event.target;
  const email = loginForm.querySelector("#email").value.trim();
  const password = loginForm.querySelector("#password").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const loginButton = loginForm.querySelector("button[type='submit']");

  if (errorMessage) errorMessage.style.display = "none";

  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  if (!email || !password) {
    showAlert("Email and password are required!", "warning");
    loginButton.disabled = false;
    loginButton.textContent = "Login";
    return;
  }

  try {
    await login({ email, password });

    showAlert("Login successful! Redirecting to your profile...", "success");

    setTimeout(() => {
      window.location.href = "/profile/";
    }, 2000);
  } catch (error) {
    console.error("Login error:", error);

    const errorMsg =
      error?.message || "Something went wrong. Please try again.";

    if (errorMessage) {
      errorMessage.innerText = `Login failed: ${errorMsg}`;
      errorMessage.style.display = "block";
    } else {
      showAlert(`Login failed: ${errorMsg}`, "error");
    }
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form[name='login']");
  if (loginForm) {
    loginForm.addEventListener("submit", onLogin);
  }
});
