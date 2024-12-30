function redirectToHome() {
  window.location.href = "index.html";
}
document.querySelectorAll(".menu-bar a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.querySelectorAll(".menu-bar a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Hide all containers initially
document.querySelectorAll(".modes").forEach((mode) => {
  mode.style.display = "none";
});

// Add event listener for the dropdown
document.getElementById("mode").addEventListener("change", function () {
  const selectedMode = this.value; // Get the selected value from the dropdown
  const allModes = document.querySelectorAll(".modes"); // Get all mode containers

  // Hide all mode containers initially
  allModes.forEach((mode) => {
    mode.style.display = "none";
  });

  // Show the selected container if a valid option is selected
  if (selectedMode) {
    const selectedContainer = document.getElementById(selectedMode);
    if (selectedContainer) {
      selectedContainer.style.display = "block";
    }
  }
});

// Optional: File upload functionality
function uploadFile() {
  const fileInput = document.getElementById("file");
  if (fileInput.files.length === 0) {
    alert("Please select a file to upload.");
    return;
  }

  const file = fileInput.files[0];
  alert(`File "${file.name}" is selected for upload.`);
  // Additional file handling logic can be implemented here
}
