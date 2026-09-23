document.addEventListener("DOMContentLoaded", () => {

    const phoneForm =
        document.getElementById("forgotPhoneForm");

    const verificationStep =
        document.getElementById("verificationStep");

    const verifyCodeButton =
        document.getElementById("verifyCodeButton");

    const newPasswordForm =
        document.getElementById("newPasswordForm");

    const message =
        document.getElementById("forgotMessage");

    const phoneInput =
        document.getElementById("forgotPhone");

    const codeInput =
        document.getElementById("verificationCode");

    const newPasswordInput =
        document.getElementById("newPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");


    let userPhone = "";
    let verificationCode = "";


    // ==============================
    // مرحله اول: شماره موبایل
    // ==============================

    phoneForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        const phone =
            phoneInput.value.trim();


        if (!/^09\d{9}$/.test(phone)) {

            showMessage(
                "شماره موبایل معتبر نیست.",
                "error"
            );

            return;
        }


        let users = [];

        try {

            users =
                JSON.parse(
                    localStorage.getItem(
                        "parsElectricUsers"
                    )
                ) || [];

        } catch {

            users = [];

        }


        const user =
            users.find(
                item =>
                    item.phone === phone
            );


        if (!user) {

            showMessage(
                "حسابی با این شماره موبایل پیدا نشد.",
                "error"
            );

            return;
        }


        userPhone = phone;


        /*
         * موقتاً برای تست:
         * کد تأیید تولید می‌شود.
         *
         * در نسخه نهایی این کد باید
         * توسط سرور به SMS تبدیل شود.
         */

        verificationCode =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();


        console.log(
            "کد تأیید تست:",
            verificationCode
        );


        phoneForm.style.display =
            "none";

        verificationStep.style.display =
            "block";


        showMessage(
            "کد تأیید ارسال شد.",
            "success"
        );

    });


    // ==============================
    // مرحله دوم: تأیید کد
    // ==============================

    verifyCodeButton?.addEventListener(
        "click",
        () => {

            const enteredCode =
                codeInput.value.trim();


            if (!/^\d{6}$/.test(enteredCode)) {

                showMessage(
                    "کد تأیید باید ۶ رقم باشد.",
                    "error"
                );

                return;
            }


            if (enteredCode !== verificationCode) {

                showMessage(
                    "کد تأیید اشتباه است.",
                    "error"
                );

                return;
            }


            verificationStep.style.display =
                "none";


            newPasswordForm.style.display =
                "block";


            showMessage(
                "کد تأیید شد. حالا رمز جدید را وارد کنید.",
                "success"
            );

        }
    );


    // ==============================
    // مرحله سوم: رمز جدید
    // ==============================

    newPasswordForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const newPassword =
                newPasswordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            if (newPassword.length < 6) {

                showMessage(
                    "رمز عبور باید حداقل ۶ کاراکتر باشد.",
                    "error"
                );

                return;
            }


            if (newPassword !== confirmPassword) {

                showMessage(
                    "تکرار رمز عبور صحیح نیست.",
                    "error"
                );

                return;
            }


            let users = [];

            try {

                users =
                    JSON.parse(
                        localStorage.getItem(
                            "parsElectricUsers"
                        )
                    ) || [];

            } catch {

                users = [];

            }


            const userIndex =
                users.findIndex(
                    user =>
                        user.phone === userPhone
                );


            if (userIndex === -1) {

                showMessage(
                    "کاربر پیدا نشد.",
                    "error"
                );

                return;
            }


            users[userIndex].password =
                newPassword;


            localStorage.setItem(
                "parsElectricUsers",
                JSON.stringify(users)
            );


            showMessage(
                "رمز عبور با موفقیت تغییر کرد ✓",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);

        }
    );


    // ==============================
    // پیام
    // ==============================

    function showMessage(text, type) {

        message.textContent =
            text;

        message.className =
            "forgot-message " + type;

    }

});