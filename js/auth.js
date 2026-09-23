document.addEventListener("DOMContentLoaded", () => {

    const usersKey = "parsElectricUsers";
    const currentUserKey = "parsElectricCurrentUser";
    const themeKey = "parsElectricTheme";

    // =========================
    // تب ورود و ثبت نام
    // =========================

    const tabs = document.querySelectorAll(".auth-tab");
    const forms = document.querySelectorAll(".auth-form");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            const tabName = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove("active"));
            forms.forEach(form => form.classList.remove("active"));

            tab.classList.add("active");

            const targetForm = document.getElementById(
                tabName === "login" ? "loginForm" : "registerForm"
            );

            if (targetForm) {
                targetForm.classList.add("active");
            }
        });
    });


    // =========================
    // پیام
    // =========================

    const message = document.getElementById("authMessage");

    function showMessage(text, type = "success") {

        if (!message) return;

        message.textContent = text;
        message.className = "auth-message " + type;
        message.style.display = "block";

        setTimeout(() => {
            message.style.display = "none";
        }, 3000);
    }


    // =========================
    // ورود
    // =========================

    const loginForm = document.getElementById("loginForm");

    loginForm?.addEventListener("submit", event => {

        event.preventDefault();

        const phone = document.getElementById("loginPhone").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!/^09\d{9}$/.test(phone)) {
            showMessage("شماره موبایل صحیح نیست.", "error");
            return;
        }

        if (!password) {
            showMessage("لطفاً رمز عبور را وارد کنید.", "error");
            return;
        }

        let users = [];

        try {
            users = JSON.parse(localStorage.getItem(usersKey)) || [];
        } catch {
            users = [];
        }

        const user = users.find(
            item => item.phone === phone && item.password === password
        );

        if (!user) {
            showMessage("شماره موبایل یا رمز عبور اشتباه است.", "error");
            return;
        }

        // ذخیره کاربر وارد شده
        localStorage.setItem(
            currentUserKey,
            JSON.stringify(user)
        );

        showMessage("ورود موفق بود ✓", "success");

        // مستقیم پنل کاربری
        setTimeout(() => {
            window.location.href = "profile.html";
        }, 700);
    });


    // =========================
    // ثبت نام
    // =========================

    const registerForm = document.getElementById("registerForm");

    registerForm?.addEventListener("submit", event => {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const phone = document.getElementById("registerPhone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const passwordConfirm =
            document.getElementById("registerPasswordConfirm").value;

        if (name.length < 3) {
            showMessage("نام و نام خانوادگی را صحیح وارد کنید.", "error");
            return;
        }

        if (!/^09\d{9}$/.test(phone)) {
            showMessage("شماره موبایل صحیح نیست.", "error");
            return;
        }

        if (password.length < 6) {
            showMessage("رمز عبور باید حداقل ۶ کاراکتر باشد.", "error");
            return;
        }

        if (password !== passwordConfirm) {
            showMessage("تکرار رمز عبور یکسان نیست.", "error");
            return;
        }

        let users = [];

        try {
            users = JSON.parse(localStorage.getItem(usersKey)) || [];
        } catch {
            users = [];
        }

        // بررسی شماره تکراری
        const existingUser = users.find(
            user => user.phone === phone
        );

        if (existingUser) {
            showMessage("این شماره موبایل قبلاً ثبت شده است.", "error");
            return;
        }

        // ساخت کاربر جدید
        const newUser = {
            id: Date.now(),
            name: name,
            phone: phone,
            password: password
        };

        users.push(newUser);

        localStorage.setItem(
            usersKey,
            JSON.stringify(users)
        );

        // ورود خودکار بعد از ثبت نام
        localStorage.setItem(
            currentUserKey,
            JSON.stringify(newUser)
        );

        showMessage("ثبت نام با موفقیت انجام شد ✓", "success");

        // مستقیم پنل کاربری
        setTimeout(() => {
            window.location.href = "profile.html";
        }, 700);
    });


    // =========================
    // حالت تاریک
    // =========================

    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {

        const savedTheme =
            localStorage.getItem(themeKey);

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                themeKey,
                isDark ? "dark" : "light"
            );
        });
    }

});