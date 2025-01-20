import { register } from "../../api/auth/register";
import { showAlert } from "../../utilities/alert";

/**
 * Handles the registration form submission.
 *
 * @param {Event} event - The form submission event.
 */
export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const registerButton = form.querySelector("button[type='submit']");

  if (errorMessage) errorMessage.style.display = "none";
  registerButton.disabled = true;
  registerButton.textContent = "Registering...";

  if (!name || !email || !password) {
    showAlert("All fields are required!", "warning");
    registerButton.disabled = false;
    registerButton.textContent = "Register";
    return;
  }

  try {
    const data = await register({ name, email, password });

    showAlert("Registration successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "/auth/login/";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);

    const errorMsg =
      error?.message || "Something went wrong. Please try again.";

    if (errorMessage) {
      errorMessage.innerText = `Registration failed: ${errorMsg}`;
      errorMessage.style.display = "block";
    } else {
      showAlert(`Registration failed: ${errorMsg}`, "error");
    }
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = "Register";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("form[name='register']");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});
