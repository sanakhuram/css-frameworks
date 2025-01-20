let spinnerTimeout;

export function showSpinner(timeout = 15000) {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.classList.remove("hidden");

    spinnerTimeout = setTimeout(() => {
      hideSpinner();
      console.warn("Spinner timeout reached. Hiding spinner.");
    }, timeout);
  }
}

export function hideSpinner() {
  const spinner = document.getElementById("spinner");
  if (spinner) {
    spinner.classList.add("hidden");

    if (spinnerTimeout) {
      clearTimeout(spinnerTimeout);
      spinnerTimeout = null;
    }
  }
}
