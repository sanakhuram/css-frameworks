import "./css/style.css";

import router from "./js/router/index.js";
import { initializeApp } from "./js/utilities/initApp.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initializeApp();
    await router(window.location.pathname);
  } catch (error) {
    console.error("Failed to initialize the app:", error);
    document.body.innerHTML =
      "<h1>An error occurred. Please try refreshing the page.</h1>";
  }
});
