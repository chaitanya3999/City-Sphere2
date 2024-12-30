function redirectToHome() {
    window.location.href = "index.html";
}
function redirectToLogin() {
    window.location.href = "Register-login.html";
    document.getElementById("login-tab");
}
function redirectToSignUp() {
    const signup = document.getElementById("register-tab");
}
document.getElementById("open-support-form").addEventListener("click", function () {
    const form = document.getElementById("support-form");
    if (form.style.display === "block") {
        form.style.display = "none";
    } else {
        form.style.display = "block";
    }
});
