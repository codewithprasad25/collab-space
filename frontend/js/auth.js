const baseUrl = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                forms.forEach(form => form.style.display = 'none');
                const targetId = tab.getAttribute('data-target');
                document.getElementById(targetId).style.display = 'block';
            });
        });
    }

    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            console.log(name, email, password);
            register(name, email, password);

        });
    }

    async function register(name, email, password) {
        try {
            const respose = await fetch(`${baseUrl}/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await respose.text();
            console.log(data);

            if (respose.ok) {
                localStorage.setItem('currentUser', email);
                alert('otp is sent to your email');
                window.location.href = 'otp.html';
            }
            if (respose.status === 400) {
                alert(data);
            }
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    }

    const otpVerifyBtn = document.getElementById('otp-verify');
    if (otpVerifyBtn) {
        otpVerifyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const otp = document.getElementById('otp').value.trim();
            console.log(otp);
            verifyOtp(otp);
        });
    }

    async function verifyOtp(otp) {
        try {
            const email = localStorage.getItem('currentUser');
            const response = await fetch(`${baseUrl}/otp/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });
            const data = await response.text();

            if (response.ok) {
                alert(data);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            }
            if (response.status === 400) {
                alert(data);
            }
        } catch (error) {
            alert('OTP verification failed. Please try again.');
        }
    }

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            console.log(email, password);
            login(email, password);
        });
    }

    async function login(email, password) {
        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.text();

            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                alert(data);
                window.location.href = 'index.html';
            }
            if (response.status === 400) {
                alert(data);
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    }


    const loginOtpBtn = document.getElementById('login-otp-btn');
    if (loginOtpBtn) {
        loginOtpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('otp-email').value.trim();
            loginWithOtp(email);
        });
    }

    async function loginWithOtp(email) {
        try {
            const response = await fetch(`${baseUrl}/login/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.text();

            if (response.ok) {
                localStorage.setItem('currentUser', email);
                alert(data);
                window.location.href = 'otp.html';
            }
            if (response.status === 400) {
                alert(data);
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    }
});