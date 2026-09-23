document.addEventListener("DOMContentLoaded", () => {

    const lastOrderKey = "parsElectricLastOrder";
    const ordersKey = "parsElectricOrders";
    const themeKey = "parsElectricTheme";
    const currentUserKey = "parsElectricCurrentUser";


    // ==============================
    // دریافت اطلاعات سفارش
    // ==============================

    const params =
        new URLSearchParams(window.location.search);

    const orderNumber =
        params.get("order");


    const orderNumberElement =
        document.getElementById("orderNumber");

    const paymentStatus =
        document.getElementById("paymentStatus");

    const orderStatus =
        document.getElementById("orderStatus");


    // ==============================
    // دریافت آخرین سفارش
    // ==============================

    let order = null;

    try {

        order = JSON.parse(
            localStorage.getItem(lastOrderKey)
        );

    } catch {

        order = null;

    }


    // اگر سفارش وجود نداشت
    if (!order) {

        console.warn(
            "اطلاعات سفارش پیدا نشد."
        );

    }


    // ==============================
    // شماره سفارش
    // ==============================

    if (orderNumberElement) {

        orderNumberElement.textContent =
            orderNumber ||
            order?.orderNumber ||
            "نامشخص";

    }


    // ==============================
    // وضعیت پرداخت
    // ==============================

    if (paymentStatus) {

        paymentStatus.textContent =
            order?.payment?.status ||
            "پرداخت موفق";

    }


    // ==============================
    // وضعیت سفارش
    // ==============================

    if (orderStatus) {

        orderStatus.textContent =
            order?.status ||
            "ثبت شده";

    }


    // ==============================
    // ذخیره سفارش در لیست سفارش‌ها
    // ==============================

    if (order) {

        try {

            let orders =
                JSON.parse(
                    localStorage.getItem(ordersKey)
                ) || [];


            // کاربر فعلی
            let currentUser = null;

            try {

                currentUser =
                    JSON.parse(
                        localStorage.getItem(
                            currentUserKey
                        )
                    );

            } catch {

                currentUser = null;

            }


            // شناسه کاربر
            const userId =
                currentUser?.id || null;


            // جلوگیری از ذخیره دوباره همان سفارش
            const alreadyExists =
                orders.some(
                    existingOrder =>
                        existingOrder.orderNumber ===
                        order.orderNumber
                );


            if (!alreadyExists) {

                const savedOrder = {

                    ...order,

                    userId: userId,

                    savedAt:
                        new Date().toISOString()

                };


                orders.push(savedOrder);


                localStorage.setItem(
                    ordersKey,
                    JSON.stringify(orders)
                );

            }

        } catch (error) {

            console.error(
                "خطا در ذخیره سفارش:",
                error
            );

        }

    }


    // ==============================
    // حالت تاریک
    // ==============================

    const themeButton =
        document.getElementById("themeToggle");


    function applyTheme() {

        const theme =
            localStorage.getItem(themeKey);


        if (theme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

        }

    }


    applyTheme();


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(
                    themeKey,
                    isDark
                        ? "dark"
                        : "light"
                );

            }
        );

    }

});