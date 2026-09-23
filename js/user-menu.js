document.addEventListener("DOMContentLoaded", () => {

    const currentUserKey = "parsElectricCurrentUser";
    const userMenu = document.getElementById("userMenu");

    if (!userMenu) return;

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem(currentUserKey)
        );
    } catch {
        currentUser = null;
    }

    // اگر کاربر وارد نشده
    if (!currentUser) {

        userMenu.innerHTML = `
            <a
                href="login.html"
                class="header-action user-login-link"
            >
                <i class="fa-regular fa-user"></i>
                <span>ورود / ثبت‌نام</span>
            </a>
        `;

        return;
    }

    // اگر وارد شده
    userMenu.innerHTML = `

        <div class="user-menu-wrapper">

            <!-- اسم کاربر فقط دکمه باز کردن منو است -->
            <button
                type="button"
                class="user-account-name"
                id="userMenuToggle"
            >
                <i class="fa-solid fa-user"></i>

                <span>
                    ${currentUser.name || "کاربر"}
                </span>

                <i class="fa-solid fa-chevron-down"></i>
            </button>


            <!-- منو -->
            <div class="user-dropdown" id="userDropdown">

                <a href="profile.html">
                    <i class="fa-solid fa-user"></i>
                    <span>پنل کاربری</span>
                </a>

                <button
                    type="button"
                    id="headerLogoutBtn"
                >
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>خروج از حساب</span>
                </button>

            </div>

        </div>
    `;


    const toggle =
        document.getElementById("userMenuToggle");

    const dropdown =
        document.getElementById("userDropdown");


    // با کلیک روی اسم، منو باز/بسته می‌شود
    toggle?.addEventListener("click", (event) => {

        event.stopPropagation();

        dropdown.classList.toggle("show");

    });


    // کلیک بیرون از منو → بستن منو
    document.addEventListener("click", (event) => {

        if (!userMenu.contains(event.target)) {
            dropdown?.classList.remove("show");
        }

    });


    // خروج
    document
        .getElementById("headerLogoutBtn")
        ?.addEventListener("click", () => {

            localStorage.removeItem(currentUserKey);

            window.location.href = "index.html";

        });

});