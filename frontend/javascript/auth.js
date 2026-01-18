const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {

    /* ================= TAB SWITCH ================= */
    const tabs = document.querySelectorAll(".tab-btn");
    const forms = document.querySelectorAll(".auth-form");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            forms.forEach(f => f.classList.remove("active"));

            tab.classList.add("active");
            document
                .getElementById(tab.dataset.target) ?
                .classList.add("active");
        });
    });

    /* ================= BUTTON HOOKS ================= */
    document.getElementById("register-btn") ?
        .addEventListener("click", registerUser);

    document.getElementById("verify-otp-btn") ?
        .addEventListener("click", verifyOtp);

    document.getElementById("login-password-btn") ?
        .addEventListener("click", loginWithPassword);

    document.getElementById("login-otp-btn") ?
        .addEventListener("click", loginWithOtp);
});

/* ================= COMMON ERROR HANDLER ================= */
async function handleResponse(response) {
    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Something went wrong");
    }

    return text;
}

/* ================= REGISTER ================= */
async function registerUser(e) {
    e.preventDefault();

    try {
        const name = document.getElementById("name") ? .value.trim();
        const email = document.getElementById("email") ? .value.trim();
        const password = document.getElementById("password") ? .value;

        if (!name || !email || !password) {
            alert("All fields are required");
            return;
        }

        const response = await fetch(`${baseUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        await handleResponse(response);

        alert("OTP sent to your email");
        window.location.href = "otp.html";

    } catch (error) {
        alert(`Registration failed: ${error.message}`);
    }
}

/* ================= VERIFY OTP ================= */
async function verifyOtp(e) {
    e.preventDefault();

    try {
        const email = document.getElementById("email") ? .value.trim();
        const otp = document.getElementById("otp") ? .value.trim();

        if (!email || !otp) {
            alert("Email and OTP required");
            return;
        }

        const response = await fetch(`${baseUrl}/otp/verify`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        await handleResponse(response);

        alert("OTP verified successfully");
        window.location.href = "login.html";

    } catch (error) {
        alert(`OTP verification failed: ${error.message}`);
    }
}

/* ================= LOGIN WITH PASSWORD ================= */
async function loginWithPassword(e) {
    e.preventDefault();

    try {
        const email = document.getElementById("login-email") ? .value.trim();
        const password = document.getElementById("login-password") ? .value;

        if (!email || !password) {
            alert("Email and password required");
            return;
        }

        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        await handleResponse(response);

        alert("Login successful");
        window.location.href = "index.html";

    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
}

/* ================= LOGIN WITH OTP ================= */
async function loginWithOtp(e) {
    e.preventDefault();

    try {
        const email = document.getElementById("login-otp-email") ? .value.trim();

        if (!email) {
            alert("Email required");
            return;
        }

        const response = await fetch(`${baseUrl}/login/${email}`, {
            method: "POST"
        });

        await handleResponse(response);

        alert("OTP sent to your email");
        window.location.href = "otp.html";

    } catch (error) {
        alert(`OTP request failed: ${error.message}`);
    }
}