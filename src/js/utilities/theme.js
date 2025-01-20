/**
 * Initializes the theme toggle functionality.
 */
export function initializeThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const rootElement = document.documentElement;

  if (localStorage.getItem("theme") === "dark") {
    rootElement.classList.add("dark");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }

  themeToggle?.addEventListener("click", () => {
    if (rootElement.classList.contains("dark")) {
      rootElement.classList.remove("dark");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      rootElement.classList.add("dark");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
}
