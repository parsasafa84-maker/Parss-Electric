document.addEventListener("DOMContentLoaded", () => {

    const currentUserKey = "parsElectricCurrentUser";
    const usersKey = "parsElectricUsers";
    const profileKey = "parsElectricProfile";

    const currentUser = JSON.parse(
        localStorage.getItem(currentUserKey)
    );

    // اگر وارد حساب نشده باشد
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const nameInput = document.getElementById("profileNameInput");
    const phoneInput = document.getElementById("profilePhoneInput");

    const profileName = document.getElementById("profileName");
    const profilePhone = document.getElementById("profilePhone");

    const avatarContainer =
        document.getElementById("avatarContainer");

    const avatarInput =
        document.getElementById("avatarInput");

    const profileForm =
        document.getElementById("profileForm");

    const message =
        document.getElementById("profileMessage");

    const logoutButton =
        document.getElementById("logoutButton");


    // ==============================
    // اطلاعات کاربر
    // ==============================

    let profileData = {};

    try {

        profileData =
            JSON.parse(
                localStorage.getItem(
                    profileKey + "_" + currentUser.id
                )
            ) || {};

    } catch {

        profileData = {};

    }


    const userName =
        profileData.name ||
        currentUser.name ||
        "کاربر";

    const userPhone =
        currentUser.phone || "";


    // ==============================
    // نمایش اطلاعات
    // ==============================

    nameInput.value = userName;

    phoneInput.value = userPhone;

    profileName.textContent = userName;

    profilePhone.textContent = userPhone;


    // ==============================
    // نمایش عکس پروفایل
    // ==============================

    if (profileData.avatar) {

        showAvatar(profileData.avatar);

    }


    function showAvatar(src) {

        avatarContainer.innerHTML = "";

        const image =
            document.createElement("img");

        image.src = src;

        image.className = "profile-avatar";

        avatarContainer.appendChild(image);

    }


    // ==============================
    // انتخاب عکس
    // ==============================

    avatarInput?.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;


            // محدودیت حجم
            if (file.size > 2 * 1024 * 1024) {

                alert(
                    "حجم عکس نباید بیشتر از ۲ مگابایت باشد."
                );

                avatarInput.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload = () => {

                const imageData =
                    reader.result;

                profileData.avatar =
                    imageData;

                showAvatar(imageData);

                saveProfileData();

            };


            reader.readAsDataURL(file);

        }
    );


    // ==============================
    // ذخیره اطلاعات
    // ==============================

    profileForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const newName =
                nameInput.value.trim();


            if (!newName) {

                showMessage(
                    "لطفاً نام و نام خانوادگی را وارد کنید.",
                    "error"
                );

                return;

            }


            if (newName.length < 3) {

                showMessage(
                    "نام باید حداقل ۳ کاراکتر باشد.",
                    "error"
                );

                return;

            }


            // ذخیره در پروفایل
            profileData.name =
                newName;


            saveProfileData();


            // بروزرسانی اطلاعات نمایش داده شده
            profileName.textContent =
                newName;


            showMessage(
                "اطلاعات پروفایل با موفقیت ذخیره شد ✓",
                "success"
            );

        }
    );


    // ==============================
    // ذخیره در localStorage
    // ==============================

    function saveProfileData() {

        localStorage.setItem(
            profileKey + "_" + currentUser.id,
            JSON.stringify(profileData)
        );


        // بروزرسانی نام کاربر در حساب فعلی
        const updatedUser = {
            ...currentUser,
            name:
                profileData.name ||
                currentUser.name
        };


        localStorage.setItem(
            currentUserKey,
            JSON.stringify(updatedUser)
        );


        // بروزرسانی اطلاعات داخل لیست کاربران
        try {

            const users =
                JSON.parse(
                    localStorage.getItem(usersKey)
                ) || [];


            const index =
                users.findIndex(
                    user =>
                        user.id === currentUser.id
                );


            if (index !== -1) {

                users[index].name =
                    updatedUser.name;

                localStorage.setItem(
                    usersKey,
                    JSON.stringify(users)
                );

            }

        } catch {

            // اگر اطلاعات کاربران خراب بود،
            // ادامه کار متوقف نمی‌شود.

        }

    }


    // ==============================
    // پیام
    // ==============================

    function showMessage(
        text,
        type = "success"
    ) {

        message.textContent = text;

        message.className =
            "profile-message " + type;

        message.style.display =
            "block";


        setTimeout(() => {

            message.style.display =
                "none";

        }, 3000);

    }


    // ==============================
    // خروج از حساب
    // ==============================

    logoutButton?.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "آیا مطمئن هستید می‌خواهید از حساب خارج شوید؟"
                );


            if (!confirmLogout) return;


            localStorage.removeItem(
                currentUserKey
            );


            window.location.href =
                "login.html";

        }
    );


});

const securityMenu = document.getElementById("securityMenu");

securityMenu?.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "change-password.html";
});
    // ==============================
    // نمایش سفارش‌های من
    // ==============================

    const ordersList =
        document.getElementById("ordersList");

    if (ordersList) {

        let orders = [];

        try {
            orders =
                JSON.parse(
                    localStorage.getItem("parsElectricOrders")
                ) || [];
        } catch {
            orders = [];
        }

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "parsElectricCurrentUser"
                )
            );

        const userOrders =
            orders.filter(
                order =>
                    order.userId === currentUser?.id
            );

        if (userOrders.length === 0) {

            ordersList.innerHTML = `
                <p>
                    هنوز سفارشی برای این حساب ثبت نشده است.
                </p>
            `;

        } else {

            ordersList.innerHTML =
                userOrders.map(order => `
                    <div class="order-item">

                        <strong>
                            سفارش شماره:
                            ${order.orderNumber || "نامشخص"}
                        </strong>

                        <p>
                            وضعیت:
                            ${order.status || "ثبت شده"}
                        </p>

                    </div>
                `).join("");

        }
    }