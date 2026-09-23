document.addEventListener("DOMContentLoaded", () => {

    const cartKey = "parsElectricCart";

    const cartItems = document.getElementById("cartItems");
    const summaryCount = document.getElementById("summaryCount");
    const summarySubtotal = document.getElementById("summarySubtotal");
    const summaryDiscount = document.getElementById("summaryDiscount");
    const summaryShipping = document.getElementById("summaryShipping");
    const summaryTotal = document.getElementById("summaryTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(cartKey)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function renderCart() {

        const cart = getCart();

        if (!cartItems) return;

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h2>سبد خرید شما خالی است</h2>
                    <p>هنوز محصولی به سبد خرید اضافه نکرده‌اید.</p>
                    <a href="products.html" class="continue-shopping">
                        مشاهده محصولات
                    </a>
                </div>
            `;

            updateSummary([]);
            return;
        }

        cartItems.innerHTML = cart.map(item => {

            const product = getProductById(Number(item.id));

            if (!product) return "";

            const price = getDiscountPrice(product);
            const totalPrice = price * item.quantity;

            return `
                <div class="cart-item">

                    <div class="cart-item-image">
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >
                    </div>

                    <div class="cart-item-info">

                        <span class="product-brand">
                            ${product.brand}
                        </span>

                        <h3>${product.name}</h3>

                        <div class="cart-item-price">
                            ${formatPrice(price)} تومان
                        </div>

                        <div class="cart-item-actions">

                            <div class="quantity-control">

                                <button
                                    data-increase="${product.id}"
                                >
                                    +
                                </button>

                                <span>${item.quantity}</span>

                                <button
                                    data-decrease="${product.id}"
                                >
                                    −
                                </button>

                            </div>

                            <button
                                class="remove-item"
                                data-remove="${product.id}"
                            >
                                <i class="fa-solid fa-trash"></i>
                                حذف
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-total">
                        ${formatPrice(totalPrice)} تومان
                    </div>

                </div>
            `;

        }).join("");

        updateSummary(cart);
    }

    function updateSummary(cart) {

        let count = 0;
        let subtotal = 0;
        let discount = 0;

        cart.forEach(item => {

            const product = getProductById(Number(item.id));

            if (!product) return;

            const originalPrice = product.price * item.quantity;
            const finalPrice = getDiscountPrice(product) * item.quantity;

            count += item.quantity;
            subtotal += originalPrice;
            discount += originalPrice - finalPrice;
        });

        const shipping = cart.length > 0 ? 0 : 0;
        const total = subtotal - discount + shipping;

        if (summaryCount) {
            summaryCount.textContent = count;
        }

        if (summarySubtotal) {
            summarySubtotal.textContent =
                `${formatPrice(subtotal)} تومان`;
        }

        if (summaryDiscount) {
            summaryDiscount.textContent =
                `${formatPrice(discount)} تومان`;
        }

        if (summaryShipping) {
            summaryShipping.textContent =
                shipping === 0
                    ? "رایگان"
                    : `${formatPrice(shipping)} تومان`;
        }

        if (summaryTotal) {
            summaryTotal.textContent =
                `${formatPrice(total)} تومان`;
        }

        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }
    }

    // افزایش تعداد
    document.addEventListener("click", event => {

        const button = event.target.closest("[data-increase]");

        if (!button) return;

        const id = Number(button.dataset.increase);
        const cart = getCart();

        const item = cart.find(item =>
            Number(item.id) === id
        );

        const product = getProductById(id);

        if (!item || !product) return;

        if (item.quantity < product.stock) {
            item.quantity++;
            saveCart(cart);
            renderCart();
        } else {
            showToast("بیشتر از موجودی انبار نمی‌توانید اضافه کنید");
        }
    });

    // کاهش تعداد
    document.addEventListener("click", event => {

        const button = event.target.closest("[data-decrease]");

        if (!button) return;

        const id = Number(button.dataset.decrease);
        const cart = getCart();

        const item = cart.find(item =>
            Number(item.id) === id
        );

        if (!item) return;

        if (item.quantity > 1) {
            item.quantity--;
        } else {
            const index = cart.findIndex(item =>
                Number(item.id) === id
            );

            cart.splice(index, 1);
        }

        saveCart(cart);
        renderCart();
    });

    // حذف محصول
    document.addEventListener("click", event => {

        const button = event.target.closest("[data-remove]");

        if (!button) return;

        const id = Number(button.dataset.remove);

        let cart = getCart();

        cart = cart.filter(item =>
            Number(item.id) !== id
        );

        saveCart(cart);

        showToast("محصول از سبد خرید حذف شد");

        renderCart();
    });

    // ادامه خرید
    if (checkoutButton) {

        checkoutButton.addEventListener("click", () => {

            const cart = getCart();

            if (cart.length === 0) {
                showToast("سبد خرید خالی است");
                return;
            }

            window.location.href = "checkout.html";
        });
    }

    function showToast(message) {

        let toast = document.getElementById("cartToast");

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "cartToast";

            toast.style.position = "fixed";
            toast.style.bottom = "25px";
            toast.style.right = "25px";
            toast.style.background = "#101828";
            toast.style.color = "#fff";
            toast.style.padding = "12px 20px";
            toast.style.borderRadius = "10px";
            toast.style.zIndex = "9999";

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.display = "block";

        clearTimeout(window.cartToastTimer);

        window.cartToastTimer = setTimeout(() => {
            toast.style.display = "none";
        }, 2500);
    }

    renderCart();
});