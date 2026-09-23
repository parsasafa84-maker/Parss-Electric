document.addEventListener("DOMContentLoaded", () => {

    const checkoutKey = "parsElectricCheckout";
    const lastOrderKey = "parsElectricLastOrder";
    const ordersKey = "parsElectricOrders";

    const paymentContent =
        document.getElementById("paymentContent");

    const paymentCount =
        document.getElementById("paymentCount");

    const paymentSubtotal =
        document.getElementById("paymentSubtotal");

    const paymentDiscount =
        document.getElementById("paymentDiscount");

    const paymentShipping =
        document.getElementById("paymentShipping");

    const paymentTotal =
        document.getElementById("paymentTotal");

    const payButton =
        document.getElementById("payButton");

    // -----------------------------
    // دریافت اطلاعات سفارش
    // -----------------------------

    let checkoutData;

    try {
        checkoutData =
            JSON.parse(localStorage.getItem(checkoutKey));
    } catch {
        checkoutData = null;
    }

    if (!checkoutData) {

        if (paymentContent) {
            paymentContent.innerHTML = `
                <div class="empty-payment">
                    <i class="fa-solid fa-file-circle-xmark"></i>
                    <h2>اطلاعات سفارش پیدا نشد</h2>
                    <p>
                        لطفاً ابتدا سبد خرید خود را تکمیل کنید.
                    </p>
                    <a href="cart.html">
                        بازگشت به سبد خرید
                    </a>
                </div>
            `;
        }

        if (payButton) {
            payButton.disabled = true;
        }

        return;
    }

    // -----------------------------
    // نمایش خلاصه سفارش
    // -----------------------------

    const order = checkoutData.order;

    if (paymentCount) {
        paymentCount.textContent =
            order.count;
    }

    if (paymentSubtotal) {
        paymentSubtotal.textContent =
            `${formatPrice(order.subtotal)} تومان`;
    }

    if (paymentDiscount) {

        const discount =
            (order.productDiscount || 0) +
            (order.couponDiscount || 0);

        paymentDiscount.textContent =
            `${formatPrice(discount)} تومان`;
    }

    if (paymentShipping) {

        paymentShipping.textContent =
            order.shipping === 0
                ? "رایگان"
                : `${formatPrice(order.shipping)} تومان`;
    }

    if (paymentTotal) {
        paymentTotal.textContent =
            `${formatPrice(order.total)} تومان`;
    }

    // -----------------------------
    // انتخاب روش پرداخت
    // -----------------------------

    const paymentMethods =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );

    paymentMethods.forEach(input => {

        input.addEventListener("change", () => {

            paymentMethods.forEach(item => {
                item.closest(".payment-method")
                    ?.classList.remove("active");
            });

            input.closest(".payment-method")
                ?.classList.add("active");
        });

    });

    // -----------------------------
    // پرداخت
    // -----------------------------

    if (payButton) {

        payButton.addEventListener("click", () => {

            const selectedMethod =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                );

            if (!selectedMethod) {
                showMessage(
                    "لطفاً روش پرداخت را انتخاب کنید"
                );
                return;
            }

            payButton.disabled = true;

            payButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                در حال پردازش پرداخت...
            `;

            /*
             * این قسمت فعلاً شبیه‌سازی پرداخت است.
             * در نسخه واقعی باید به درگاه پرداخت متصل شود.
             */

            setTimeout(() => {

                const orderNumber =
                    "PE-" +
                    Date.now()
                        .toString()
                        .slice(-8);

                const finalOrder = {

                    orderNumber,

                    customer:
                        checkoutData.customer,

                    address:
                        checkoutData.address,

                    shipping:
                        checkoutData.shipping,

                    order:
                        checkoutData.order,

                    coupon:
                        checkoutData.coupon,

                    cart:
                        checkoutData.cart,

                    payment: {

                        method:
                            selectedMethod.value,

                        status:
                            "پرداخت موفق",

                        paidAt:
                            new Date().toISOString()
                    },

                    status:
                        "ثبت شده",

                    createdAt:
                        checkoutData.createdAt
                };

                // آخرین سفارش
                localStorage.setItem(
                    lastOrderKey,
                    JSON.stringify(finalOrder)
                );

                // لیست سفارش‌ها
                let orders = [];

                try {
                    orders =
                        JSON.parse(
                            localStorage.getItem(ordersKey)
                        ) || [];
                } catch {
                    orders = [];
                }

                orders.push(finalOrder);

                localStorage.setItem(
                    ordersKey,
                    JSON.stringify(orders)
                );

                // خالی کردن سبد خرید
                localStorage.removeItem(
                    "parsElectricCart"
                );

                // حذف اطلاعات موقت پرداخت
                localStorage.removeItem(
                    checkoutKey
                );

                // انتقال به صفحه موفقیت
                window.location.href =
                    `order-success.html?order=${encodeURIComponent(orderNumber)}`;

            }, 1500);
        });
    }

    // -----------------------------
    // پیام
    // -----------------------------

    function showMessage(message) {

        let toast =
            document.getElementById("paymentToast");

        if (!toast) {

            toast =
                document.createElement("div");

            toast.id = "paymentToast";

            toast.style.position = "fixed";
            toast.style.bottom = "25px";
            toast.style.right = "25px";
            toast.style.background = "#101828";
            toast.style.color = "#fff";
            toast.style.padding = "12px 20px";
            toast.style.borderRadius = "10px";
            toast.style.zIndex = "9999";
            toast.style.fontSize = "14px";

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.display = "block";

        clearTimeout(
            window.paymentToastTimer
        );

        window.paymentToastTimer =
            setTimeout(() => {
                toast.style.display = "none";
            }, 3000);
    }

});