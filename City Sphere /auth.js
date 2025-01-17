// Handle login form submission
async function handleLogin(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard or home
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message);
    }
}

// Handle signup form submission
async function handleSignup(fullname, email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullname, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard or home
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Signup error:', error);
        alert(error.message);
    }
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
        // Update UI for logged-in user
        document.querySelectorAll('.nav-buttons').forEach(div => {
            div.innerHTML = `
                <span class="welcome-text">Welcome, ${user.fullname}</span>
                <button onclick="handleLogout()" class="btn btn-login">
                    <i class="fas fa-sign-out-alt"></i>Logout
                </button>
            `;
        });
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Setup login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleLogin(email, password);
        });
    }

    // Setup signup form handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            handleSignup(fullname, email, password);
        });
    }
});
