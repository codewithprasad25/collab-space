// REGISTER → OTP
document.getElementById("registerForm") ? addEventListener("submit", e => {
    e.preventDefault();
    window.location.href = "otp.html";
});

// OTP → LOGIN
document.getElementById("otpForm") ? addEventListener("submit", e => {
    e.preventDefault();
    window.location.href = "login.html";
});

// LOGIN TABS
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".login-form");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        forms.forEach(f => f.classList.remove("active"));

        tab.classList.add("active");
        document
            .getElementById(tab.dataset.target)
            .classList.add("active");
    });
});

// LOGIN → APP
forms.forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();
        window.location.href = "index.html";
    });
});