// Determine base URL dynamically
const getBaseUrl = () => {
    const currentHost = window.location.hostname;
    
    if (currentHost === '127.0.0.1' || currentHost === '::1') {
        return 'http://127.0.0.1:8080';
    }
    if (currentHost === 'localhost') {
        return 'http://localhost:8080';
    }
    return `http://${currentHost}:8080`;
};

const baseUrl = getBaseUrl();
console.log('Auth service using base URL:', baseUrl);

document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    // Handle login method tabs (Password / Email OTP)
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                forms.forEach(form => form.style.display = 'none');
                const targetId = tab.getAttribute('data-target');
                const targetForm = document.getElementById(targetId);
                if (targetForm) targetForm.style.display = 'block';
            });
        });
    }

    // -------------------
    // Registration (email + password)
    // -------------------

    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('register-btn');

    if (registerForm && registerBtn) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            register(name, email, password);
        });
    }

    async function register(name, email, password) {
        if (!name || !email || !password) {
            alert('All fields are required');
            return;
        }
        try {
            console.log('Register attempt with:', name, email);
            const response = await fetch(`${baseUrl}/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });
            const text = await response.text();
            console.log('Registration response:', text);

            if (response.ok) {
                // Save pending user info for OTP verification
                localStorage.setItem('pendingEmail', email);
                localStorage.setItem('pendingName', name);
                alert(text || 'Registration successful. OTP sent to your email.');
                window.location.href = 'otp.html';
            } else {
                alert(text || 'Registration failed');
                console.error('Registration failed:', text);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed: ' + error.message);
        }
    }

    // -------------------
    // OTP verification (for both registration and OTP-login)
    // -------------------

    const otpForm = document.getElementById('otpForm');
    const otpVerifyBtn = document.getElementById('otp-verify');

    if (otpForm && otpVerifyBtn) {
        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const otp = document.getElementById('otp').value.trim();
            verifyOtp(otp);
        });
    }

    async function verifyOtp(otp) {
        const email = localStorage.getItem('pendingEmail') || localStorage.getItem('currentUser');

        if (!email) {
            alert('No email found for OTP verification. Please start login/registration again.');
            return;
        }

        if (!otp) {
            alert('Please enter the OTP');
            return;
        }

        try {
            console.log('OTP verification for:', email);
            const response = await fetch(`${baseUrl}/otp/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: Number(otp) })
            });
            const text = await response.text();
            console.log('OTP verification response:', text);

            if (response.ok) {
                alert(text || 'OTP verified successfully');
                const pendingName = localStorage.getItem('pendingName');

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', email);
                if (pendingName) {
                    localStorage.setItem('userName', pendingName);
                }
                // Clear pending data
                localStorage.removeItem('pendingEmail');
                localStorage.removeItem('pendingName');

                window.location.href = 'index.html';
            } else {
                alert(text || 'OTP verification failed');
                console.error('OTP verification failed:', text);
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            alert('OTP verification failed: ' + error.message);
        }
    }

    // -------------------
    // Login with email + password
    // -------------------

    const loginForm = document.getElementById('email-pass-form');
    const loginBtn = document.getElementById('login-btn');

    if (loginForm && loginBtn) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            login(email, password);
        });
    }

    async function login(email, password) {
        if (!email || !password) {
            alert('Email and password are required');
            return;
        }

        try {
            console.log('Login attempt with:', email);
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Response data:', text);

            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', email);
                alert(text || 'Login successful');
                window.location.href = 'index.html';
            } else {
                alert(text || 'Login failed');
                console.error('Login failed:', text);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    }

    // -------------------
    // Login with email OTP (magic link style)
    // -------------------

    const loginOtpForm = document.getElementById('email-otp-form');
    const loginOtpBtn = document.getElementById('login-otp-btn');

    if (loginOtpForm && loginOtpBtn) {
        loginOtpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('otp-email').value.trim();
            loginWithOtp(email);
        });
    }

    async function loginWithOtp(email) {
        if (!email) {
            alert('Email is required');
            return;
        }

        try {
            console.log('Login with OTP for:', email);
            const response = await fetch(`${baseUrl}/login/${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const text = await response.text();
            console.log('Login OTP response:', text);

            if (response.ok) {
                // Save pending email for OTP verification
                localStorage.setItem('pendingEmail', email);
                alert(text || 'OTP sent to your email');
                window.location.href = 'otp.html';
            } else {
                alert(text || 'Failed to send OTP');
                console.error('Login OTP failed:', text);
            }
        } catch (error) {
            console.error('Login OTP error:', error);
            alert('Login failed: ' + error.message);
        }
    }
});