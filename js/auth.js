document.addEventListener('DOMContentLoaded', () => {
    const authModalContainer = document.getElementById('auth-modal-container');
    const authContent = document.querySelector('.auth-content');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn-main');
    const closeModalBtn = document.getElementById('close-auth-modal');

    if (!authModalContainer || !authContent || !loginBtn || !signupBtn || !closeModalBtn) {
        // If elements are not on the page (e.g., on app.html), do nothing.
        return;
    }

    const loginFormHTML = `
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Log in to continue your journey.</p>
        <form id="login-form">
            <div class="form-group">
                <input type="email" id="login-email" required>
                <label for="login-email">Email</label>
            </div>
            <div class="form-group">
                <input type="password" id="login-password" required>
                <label for="login-password">Password</label>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Log In</button>
        </form>
        <p class="auth-switch">Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
    `;

    const signupFormHTML = `
        <h2 class="auth-title">Get Started</h2>
        <p class="auth-subtitle">Create an account to begin the ultimate experience.</p>
        <form id="signup-form">
            <div class="form-group">
                <input type="text" id="signup-name" required>
                <label for="signup-name">Full Name</label>
            </div>
            <div class="form-group">
                <input type="email" id="signup-email" required>
                <label for="signup-email">Email</label>
            </div>
            <div class="form-group">
                <input type="password" id="signup-password" required>
                <label for="signup-password">Password</label>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Create Account</button>
        </form>
        <p class="auth-switch">Already have an account? <a href="#" id="show-login">Log In</a></p>
    `;

    const showModal = (content) => {
        authContent.innerHTML = content;
        authModalContainer.classList.remove('hidden');
        attachFormListeners();
    };

    const hideModal = () => {
        authModalContainer.classList.add('hidden');
    };

    const attachFormListeners = () => {
        const showSignupLink = document.getElementById('show-signup');
        const showLoginLink = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (showSignupLink) {
            showSignupLink.addEventListener('click', (e) => {
                e.preventDefault();
                showModal(signupFormHTML);
            });
        }

        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                showModal(loginFormHTML);
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simulate login
                const user = { name: 'Demo User', email: document.getElementById('login-email').value };
                localStorage.setItem('stellar-user', JSON.stringify(user));
                window.location.href = 'app.html';
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simulate signup and login
                const user = { name: document.getElementById('signup-name').value, email: document.getElementById('signup-email').value };
                localStorage.setItem('stellar-user', JSON.stringify(user));
                window.location.href = 'app.html';
            });
        }
    };

    loginBtn.addEventListener('click', () => showModal(loginFormHTML));
    signupBtn.addEventListener('click', () => showModal(signupFormHTML));
    closeModalBtn.addEventListener('click', hideModal);

    // Close modal on outside click
    authModalContainer.addEventListener('click', (e) => {
        if (e.target === authModalContainer) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !authModalContainer.classList.contains('hidden')) {
            hideModal();
        }
    });
});