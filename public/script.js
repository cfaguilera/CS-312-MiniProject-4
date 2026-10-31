
/* Functionality for the theme toggle button and year display */

const themeToggle = document.querySelector("#theme-toggle");
const yearDisplay = document.querySelector("#year");

themeToggle.addEventListener("click", () => {
  const darkModeIsOn = document.body.classList.toggle("dark");
  themeToggle.textContent = darkModeIsOn ? "Light mode" : "Dark mode";
});

yearDisplay.textContent = new Date().getFullYear();
