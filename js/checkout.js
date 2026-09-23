document.addEventListener("DOMContentLoaded", () => {

    const cartKey = "parsElectricCart";
    const checkoutKey = "parsElectricCheckout";

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const phone = document.getElementById("phone");
    const postalCode = document.getElementById("postalCode");
    const province = document.getElementById("province");
    const city = document.getElementById("city");
    const address = document.getElementById("address");

    const couponCode = document.getElementById("couponCode");
    const applyCoupon = document.getElementById("applyCoupon");

    const checkoutCount = document.getElementById("checkoutCount");
    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutDiscount = document.getElementById("checkoutDiscount");
    const checkoutShipping = document.getElementById("checkoutShipping");
    const checkoutTotal = document.getElementById("checkoutTotal");

    const continuePayment =
        document.getElementById("continuePayment");

    let appliedCoupon = null;

    // -----------------------------
    // دریافت سبد خرید
    // -----------------------------

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(cartKey)) || [];
        } catch {
            return [];
        }
    }

    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    // -----------------------------
    // محاسبه سفارش
    // -----------------------------

    function calculateOrder() {

        let count = 0;
        let subtotal = 0;
        let productDiscount = 0;

        cart.forEach(item => {

            const product = getProductById(Number(item.id));

            if (!product) return;

            count += item.quantity;

            const original =
                product.price * item.quantity;

            const final =
                getDiscountPrice(product) * item.quantity;

            subtotal += original;
            productDiscount += original - final;
        });

        // تخفیف کد
        let couponDiscount = 0;

        if (appliedCoupon) {

            if (appliedCoupon.type === "percent") {
                couponDiscount =
                    Math.round(
                        (subtotal - productDiscount) *
                        appliedCoupon.value / 100
                    );
            }

            if (appliedCoupon.type === "fixed") {
                couponDiscount = appliedCoupon.value;
            }
        }

        const selectedShipping =
            document.querySelector(
                'input[name="shipping"]:checked'
            );

        const shipping = selectedShipping
            ? Number(selectedShipping.dataset.price || 0)
            : 0;

        const total =
            subtotal -
            productDiscount -
            couponDiscount +
            shipping;

        updateSummary(
            count,
            subtotal,
            productDiscount + couponDiscount,
            shipping,
            total
        );

        return {
            count,
            subtotal,
            productDiscount,
            couponDiscount,
            shipping,
            total
        };
    }

    // -----------------------------
    // نمایش خلاصه
    // -----------------------------

    function updateSummary(
        count,
        subtotal,
        discount,
        shipping,
        total
    ) {

        if (checkoutCount) {
            checkoutCount.textContent = count;
        }

        if (checkoutSubtotal) {
            checkoutSubtotal.textContent =
                `${formatPrice(subtotal)} تومان`;
        }

        if (checkoutDiscount) {
            checkoutDiscount.textContent =
                `${formatPrice(discount)} تومان`;
        }

        if (checkoutShipping) {
            checkoutShipping.textContent =
                shipping === 0
                    ? "رایگان"
                    : `${formatPrice(shipping)} تومان`;
        }

        if (checkoutTotal) {
            checkoutTotal.textContent =
                `${formatPrice(total)} تومان`;
        }
    }

    // -----------------------------
    // کد تخفیف
    // -----------------------------

    if (applyCoupon) {

        applyCoupon.addEventListener("click", () => {

            const code =
                couponCode.value.trim().toUpperCase();

            if (!code) {
                showMessage("کد تخفیف را وارد کنید");
                return;
            }

            if (code === "PARS10") {

                appliedCoupon = {
                    code: "PARS10",
                    type: "percent",
                    value: 10
                };

                showMessage(
                    "کد تخفیف ۱۰٪ با موفقیت اعمال شد 🎉"
                );

            } else if (code === "PARS50") {

                appliedCoupon = {
                    code: "PARS50",
                    type: "fixed",
                    value: 50000
                };

                showMessage(
                    "۵۰ هزار تومان تخفیف اعمال شد 🎉"
                );

            } else {

                appliedCoupon = null;

                showMessage(
                    "کد تخفیف معتبر نیست"
                );

                calculateOrder();
                return;
            }

            calculateOrder();
        });
    }

    // -----------------------------
    // تغییر روش ارسال
    // -----------------------------

    document
        .querySelectorAll('input[name="shipping"]')
        .forEach(input => {

            input.addEventListener("change", () => {
                calculateOrder();
            });

        });

    // -----------------------------
    // اعتبارسنجی
    // -----------------------------

    function validateForm() {

        if (!firstName.value.trim()) {
            showMessage("نام را وارد کنید");
            firstName.focus();
            return false;
        }

        if (!lastName.value.trim()) {
            showMessage("نام خانوادگی را وارد کنید");
            lastName.focus();
            return false;
        }

        const phoneValue = phone.value.trim();

        if (!/^09\d{9}$/.test(phoneValue)) {
            showMessage(
                "شماره موبایل را صحیح وارد کنید"
            );

            phone.focus();
            return false;
        }

        const postalValue =
            postalCode.value.trim();

        if (!/^\d{10}$/.test(postalValue)) {
            showMessage(
                "کد پستی باید ۱۰ رقم باشد"
            );

            postalCode.focus();
            return false;
        }

        if (!province.value.trim()) {
            showMessage("استان را وارد کنید");
            province.focus();
            return false;
        }

        if (!city.value.trim()) {
            showMessage("شهر را وارد کنید");
            city.focus();
            return false;
        }

        if (!address.value.trim()) {
            showMessage("آدرس را وارد کنید");
            address.focus();
            return false;
        }

        return true;
    }

    // -----------------------------
    // ادامه به پرداخت
    // -----------------------------

    if (continuePayment) {

        continuePayment.addEventListener("click", () => {

            if (!validateForm()) {
                return;
            }

            const order = calculateOrder();

            const selectedShipping =
                document.querySelector(
                    'input[name="shipping"]:checked'
                );

            const checkoutData = {

                customer: {
                    firstName:
                        firstName.value.trim(),

                    lastName:
                        lastName.value.trim(),

                    phone:
                        phone.value.trim()
                },

                address: {
                    postalCode:
                        postalCode.value.trim(),

                    province:
                        province.value.trim(),

                    city:
                        city.value.trim(),

                    address:
                        address.value.trim()
                },

                shipping: {
                    title:
                        selectedShipping
                            ? selectedShipping.dataset.title ||
                              selectedShipping.parentElement?.innerText ||
                              "ارسال"
                            : "ارسال",

                    price: order.shipping
                },

                order: {
                    count: order.count,
                    subtotal: order.subtotal,
                    productDiscount:
                        order.productDiscount,
                    couponDiscount:
                        order.couponDiscount,
                    shipping:
                        order.shipping,
                    total:
                        order.total
                },

                coupon: appliedCoupon,

                cart: cart,

                createdAt:
                    new Date().toISOString()
            };

            localStorage.setItem(
                checkoutKey,
                JSON.stringify(checkoutData)
            );

            window.location.href =
                "payment.html";
        });
    }

    // -----------------------------
    // پیام
    // -----------------------------

    function showMessage(message) {

        let box =
            document.getElementById("checkoutMessage");

        if (!box) {

            box = document.createElement("div");

            box.id = "checkoutMessage";

            box.style.position = "fixed";
            box.style.bottom = "25px";
            box.style.right = "25px";
            box.style.background = "#101828";
            box.style.color = "#fff";
            box.style.padding = "12px 20px";
            box.style.borderRadius = "10px";
            box.style.zIndex = "9999";
            box.style.fontSize = "14px";

            document.body.appendChild(box);
        }

        box.textContent = message;
        box.style.display = "block";

        clearTimeout(
            window.checkoutMessageTimer
        );

        window.checkoutMessageTimer =
            setTimeout(() => {
                box.style.display = "none";
            }, 3000);
    }

    // نمایش اولیه
    calculateOrder();
});