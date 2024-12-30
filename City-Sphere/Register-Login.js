function redirectToHome() {
  window.location.href = "index.html";
}

const registerTab = document.getElementById("register-tab");
const loginTab = document.getElementById("login-tab");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
});

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
});

document.getElementById("switch-to-register").addEventListener("click", (e) => {
  e.preventDefault();
  registerTab.click();
});

document.getElementById("switch-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  loginTab.click();
});
