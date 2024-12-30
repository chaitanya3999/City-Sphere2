function redirectToHome() {
  window.location.href = "index.html";
}
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
const form1 = document.querySelector("#form1");
const form2 = document.querySelector("#form2");
form1.style.display = "block";
form2.style.display = "none";
function showForm2(event) {
  event.preventDefault();
  form2.style.display = "block";
  form1.style.display = "none";
}
