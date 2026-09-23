document.addEventListener("DOMContentLoaded", () => {

    const ordersList =
        document.getElementById("ordersList");

    const currentUser =
        JSON.parse(
            localStorage.getItem("parsElectricCurrentUser")
        );

    if (!currentUser) {

        ordersList.innerHTML = `
            <div class="orders-empty">
                <i class="fa-solid fa-user-lock"></i>

                <h2>ابتدا وارد حساب شوید</h2>

                <p>
                    برای مشاهده سفارش‌های خود وارد حساب کاربری شوید.
                </p>

                <a href="login.html">
                    ورود به حساب
                </a>
            </div>
        `;

        return;
    }


    // ==============================
    // دریافت سفارش‌ها
    // ==============================

    let orders = [];

    try {

        orders =
            JSON.parse(
                localStorage.getItem("parsElectricOrders")
            ) || [];

    } catch {

        orders = [];

    }


    // فقط سفارش‌های کاربر فعلی
    const userOrders =
        orders.filter(
            order =>
                String(order.userId) ===
                String(currentUser.id)
        );


    // ==============================
    // اگر سفارشی وجود نداشت
    // ==============================

    if (userOrders.length === 0) {

        ordersList.innerHTML = `
            <div class="orders-empty">

                <i class="fa-solid fa-box-open"></i>

                <h2>هنوز سفارشی ثبت نکرده‌اید</h2>

                <p>
                    بعد از ثبت سفارش، اطلاعات سفارش‌های شما
                    در این قسمت نمایش داده می‌شود.
                </p>

                <a href="products.html">
                    مشاهده محصولات
                </a>

            </div>
        `;

        return;
    }


    // ==============================
    // نمایش سفارش‌ها
    // ==============================

    ordersList.innerHTML =
        userOrders
            .slice()
            .reverse()
            .map(order => {

                const date =
                    order.savedAt
                        ? new Date(
                            order.savedAt
                        ).toLocaleDateString(
                            "fa-IR"
                        )
                        : "نامشخص";


                const total =
                    order.total ||
                    order.finalPrice ||
                    order.price ||
                    0;


                const paymentStatus =
                    order.payment?.status ||
                    "پرداخت موفق";


                const orderStatus =
                    order.status ||
                    "ثبت شده";


                return `

                    <div class="order-card">

                        <div class="order-card-header">

                            <div>

                                <span>
                                    شماره سفارش
                                </span>

                                <strong>
                                    ${order.orderNumber || "نامشخص"}
                                </strong>

                            </div>


                            <span class="order-status">
                                ${orderStatus}
                            </span>

                        </div>


                        <div class="order-card-info">

                            <div>
                                <i class="fa-regular fa-calendar"></i>

                                <span>
                                    تاریخ ثبت:
                                </span>

                                <strong>
                                    ${date}
                                </strong>
                            </div>


                            <div>
                                <i class="fa-solid fa-credit-card"></i>

                                <span>
                                    پرداخت:
                                </span>

                                <strong>
                                    ${paymentStatus}
                                </strong>
                            </div>


                            <div>
                                <i class="fa-solid fa-money-bill"></i>

                                <span>
                                    مبلغ:
                                </span>

                                <strong>
                                    ${Number(total).toLocaleString("fa-IR")}
                                    تومان
                                </strong>
                            </div>

                        </div>


                        <div class="order-card-actions">

                            <button
                                type="button"
                                class="invoice-btn"
                                data-order="${order.orderNumber || ""}"
                            >
                                <i class="fa-solid fa-file-invoice"></i>
                                مشاهده فاکتور
                            </button>

                            <button
                                type="button"
                                class="details-btn"
                                data-order="${order.orderNumber || ""}"
                            >
                                <i class="fa-solid fa-eye"></i>
                                جزئیات سفارش
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");


// ==============================
// نمایش فاکتور داخل همان سفارش
// ==============================

document
    .querySelectorAll(".invoice-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const orderNumber =
                button.dataset.order;

            const order =
                userOrders.find(
                    item =>
                        String(item.orderNumber) ===
                        String(orderNumber)
                );

            if (!order) {
                alert("اطلاعات فاکتور پیدا نشد.");
                return;
            }

            // اگر فاکتور قبلاً باز شده، ببند
            const oldInvoice =
                document.getElementById(
                    `invoice-${orderNumber}`
                );

            if (oldInvoice) {

                oldInvoice.remove();

                return;
            }


            // محصولات سفارش
            const products =
                order.items ||
                order.products ||
                [];


            let productsHTML = "";

            if (products.length > 0) {

                productsHTML =
                    products.map(item => {

                        const name =
                            item.name ||
                            "محصول";

                        const quantity =
                            item.quantity ||
                            item.count ||
                            1;

                        const price =
                            item.price ||
                            0;

                        return `
                            <div class="invoice-product">

                                <span>
                                    ${name}
                                </span>

                                <span>
                                    × ${quantity}
                                </span>

                                <strong>
                                    ${Number(price).toLocaleString("fa-IR")}
                                    تومان
                                </strong>

                            </div>
                        `;

                    }).join("");

            } else {

                productsHTML = `
                    <p class="invoice-no-products">
                        جزئیات محصولات این سفارش موجود نیست.
                    </p>
                `;

            }


            const total =
                order.total ||
                order.finalPrice ||
                order.price ||
                0;


            const invoice =
                document.createElement("div");

            invoice.id =
                `invoice-${orderNumber}`;

            invoice.className =
                "order-invoice";


            invoice.innerHTML = `

                <div class="invoice-title">

                    <div>
                        <i class="fa-solid fa-file-invoice"></i>

                        <strong>
                            فاکتور سفارش
                        </strong>
                    </div>

                    <span>
                        #${orderNumber}
                    </span>

                </div>


                <div class="invoice-products">

                    ${productsHTML}

                </div>


                <div class="invoice-summary">

                    <div>
                        <span>وضعیت پرداخت</span>

                        <strong>
                            ${order.payment?.status || "پرداخت موفق"}
                        </strong>
                    </div>


                    <div>
                        <span>وضعیت سفارش</span>

                        <strong>
                            ${order.status || "ثبت شده"}
                        </strong>
                    </div>


                    <div class="invoice-total">

                        <span>
                            مبلغ نهایی
                        </span>

                        <strong>
                            ${Number(total).toLocaleString("fa-IR")}
                            تومان
                        </strong>

                    </div>

                </div>

            `;


            // قرار دادن فاکتور زیر همان سفارش
            const orderCard =
                button.closest(".order-card");

            orderCard?.appendChild(invoice);

        });

    });


    // ==============================
    // جزئیات سفارش
    // ==============================

    document
        .querySelectorAll(".details-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const orderNumber =
                        button.dataset.order;

                    alert(
                        "جزئیات سفارش " +
                        orderNumber +
                        " در مرحله بعد اضافه می‌شود."
                    );

                }
            );

        });

});
