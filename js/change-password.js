document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("changePasswordForm");
    const message = document.getElementById("changePasswordMessage");

    const currentPasswordInput =
        document.getElementById("currentPassword");

    const newPasswordInput =
        document.getElementById("newPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");


    // بررسی ورود کاربر
    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("parsElectricCurrentUser")
        );
    } catch {
        currentUser = null;
    }


    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }


    form?.addEventListener("submit", (event) => {

        event.preventDefault();


        const currentPassword =
            currentPasswordInput.value;

        const newPassword =
            newPasswordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // دریافت کاربران
        let users = [];

        try {
            users =
                JSON.parse(
                    localStorage.getItem("parsElectricUsers")
                ) || [];
        } catch {
            users = [];
        }


        // پیدا کردن کاربر فعلی
        const userIndex = users.findIndex(
            user =>
                String(user.id) === String(currentUser.id)
        );


        if (userIndex === -1) {
            showMessage(
                "حساب کاربری پیدا نشد.",
                "error"
            );
            return;
        }


        const user = users[userIndex];


        // بررسی رمز فعلی
        if (user.password !== currentPassword) {
            showMessage(
                "رمز عبور فعلی اشتباه است.",
                "error"
            );
            return;
        }


        // بررسی طول رمز جدید
        if (newPassword.length < 6) {
            showMessage(
                "رمز عبور جدید باید حداقل ۶ کاراکتر باشد.",
                "error"
            );
            return;
        }


        // بررسی تکرار رمز
        if (newPassword !== confirmPassword) {
            showMessage(
                "تکرار رمز عبور صحیح نیست.",
                "error"
            );
            return;
        }


        // جلوگیری از یکسان بودن رمز قدیم و جدید
        if (newPassword === currentPassword) {
            showMessage(
                "رمز جدید باید با رمز قبلی متفاوت باشد.",
                "error"
            );
            return;
        }


        // ذخیره رمز جدید
        users[userIndex].password = newPassword;

        localStorage.setItem(
            "parsElectricUsers",
            JSON.stringify(users)
        );


        showMessage(
            "رمز عبور با موفقیت تغییر کرد ✓",
            "success"
        );


        // پاک کردن فیلدها
        form.reset();


        // برگشت به پنل بعد از چند لحظه
        setTimeout(() => {
            window.location.href = "profile.html";
        }, 1500);

    });


    function showMessage(text, type) {

        message.textContent = text;

        message.className =
            "change-password-message " + type;

        message.style.display = "block";
    }

});