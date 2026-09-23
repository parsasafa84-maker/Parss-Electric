document.addEventListener("DOMContentLoaded", () => {

    const favoritesKey = "parsElectricFavorites";
    const cartKey = "parsElectricCart";
    const themeKey = "parsElectricTheme";

    const container =
        document.getElementById("favoritesContainer");

    const emptyState =
        document.getElementById("favoritesEmpty");

    const countElement =
        document.getElementById("favoritesCount");

    if (!container) return;

    // -----------------------------
    // علاقه‌مندی‌ها
    // -----------------------------

    function getFavorites() {
        try {
            return JSON.parse(
                localStorage.getItem(favoritesKey)
            ) || [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        localStorage.setItem(
            favoritesKey,
            JSON.stringify(favorites)
        );
    }

    // -----------------------------
    // سبد خرید
    // -----------------------------

    function getCart() {
        try {
            return JSON.parse(
                localStorage.getItem(cartKey)
            ) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(
            cartKey,
            JSON.stringify(cart)
        );
    }

    // -----------------------------
    // نمایش محصولات
    // -----------------------------

    function renderFavorites() {

        const favorites = getFavorites();

        const favoriteProducts =
            favorites
                .map(id => getProductById(Number(id)))
                .filter(product => product);

        if (countElement) {
            countElement.textContent =
                favoriteProducts.length;
        }

        if (favoriteProducts.length === 0) {

            container.innerHTML = "";

            if (emptyState) {
                emptyState.style.display = "block";
            }

            return;
        }

        if (emptyState) {
            emptyState.style.display = "none";
        }

        container.innerHTML =
            favoriteProducts.map(product => {

                const finalPrice =
                    getDiscountPrice(product);

                return `
                    <div class="favorite-card">

                        <div
                            class="favorite-image"
                            data-product-id="${product.id}"
                        >
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >
                        </div>

                        <div class="favorite-info">

                            <span class="favorite-brand">
                                ${product.brand}
                            </span>

                            <h3>
                                ${product.name}
                            </h3>

                            <div class="favorite-rating">

                                <span>
                                    ${"★".repeat(
                                        Math.round(product.rating)
                                    )}
                                </span>

                                <small>
                                    ${product.rating}
                                    (${product.reviews} نظر)
                                </small>

                            </div>

                            <div class="favorite-price">

                                ${
                                    product.discount > 0
                                        ? `
                                            <span class="favorite-old-price">
                                                ${formatPrice(product.price)}
                                                تومان
                                            </span>
                                        `
                                        : ""
                                }

                                <strong>
                                    ${formatPrice(finalPrice)}
                                    تومان
                                </strong>

                            </div>

                            <div class="favorite-actions">

                                <button
                                    class="favorite-add-cart"
                                    data-add-cart="${product.id}"
                                    ${
                                        product.stock <= 0
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    <i class="fa-solid fa-cart-plus"></i>
                                    ${
                                        product.stock > 0
                                            ? "افزودن به سبد"
                                            : "ناموجود"
                                    }
                                </button>

                                <button
                                    class="favorite-remove"
                                    data-remove-favorite="${product.id}"
                                    title="حذف از علاقه‌مندی‌ها"
                                >
                                    <i class="fa-solid fa-heart"></i>
                                </button>

                            </div>

                        </div>

                    </div>
                `;

            }).join("");
    }

    // -----------------------------
    // کلیک روی محصول
    // -----------------------------

    document.addEventListener(
        "click",
        event => {

            const image =
                event.target.closest(
                    "[data-product-id]"
                );

            if (!image) return;

            const id =
                Number(image.dataset.productId);

            window.location.href =
                `product.html?id=${id}`;
        }
    );

    // -----------------------------
    // حذف علاقه‌مندی
    // -----------------------------

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-remove-favorite]"
                );

            if (!button) return;

            const id =
                Number(
                    button.dataset.removeFavorite
                );

            let favorites =
                getFavorites();

            favorites =
                favorites.filter(
                    favoriteId =>
                        Number(favoriteId) !== id
                );

            saveFavorites(favorites);

            showToast(
                "محصول از علاقه‌مندی‌ها حذف شد"
            );

            renderFavorites();
        }
    );

    // -----------------------------
    // افزودن به سبد خرید
    // -----------------------------

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-add-cart]"
                );

            if (!button) return;

            const id =
                Number(button.dataset.addCart);

            const product =
                getProductById(id);

            if (!product || product.stock <= 0) {
                showToast(
                    "این محصول موجود نیست"
                );
                return;
            }

            const cart =
                getCart();

            const existing =
                cart.find(
                    item =>
                        Number(item.id) === id
                );

            if (existing) {

                if (
                    existing.quantity <
                    product.stock
                ) {
                    existing.quantity++;
                } else {
                    showToast(
                        "بیشتر از موجودی نمی‌توانید اضافه کنید"
                    );
                    return;
                }

            } else {

                cart.push({
                    id: id,
                    quantity: 1
                });
            }

            saveCart(cart);

            showToast(
                "محصول به سبد خرید اضافه شد 🛒"
            );
        }
    );

    // -----------------------------
    // پیام
    // -----------------------------

    function showToast(message) {

        let toast =
            document.getElementById(
                "favoritesToast"
            );

        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "favoritesToast";

            toast.style.position =
                "fixed";

            toast.style.bottom =
                "25px";

            toast.style.right =
                "25px";

            toast.style.background =
                "#101828";

            toast.style.color =
                "#fff";

            toast.style.padding =
                "12px 20px";

            toast.style.borderRadius =
                "10px";

            toast.style.zIndex =
                "9999";

            toast.style.fontSize =
                "14px";

            document.body.appendChild(toast);
        }

        toast.textContent =
            message;

        toast.style.display =
            "block";

        clearTimeout(
            window.favoritesToastTimer
        );

        window.favoritesToastTimer =
            setTimeout(() => {

                toast.style.display =
                    "none";

            }, 2500);
    }

    // -----------------------------
    // حالت تاریک
    // -----------------------------

    const themeButton =
        document.getElementById(
            "themeToggle"
        );

    function applyTheme() {

        const theme =
            localStorage.getItem(themeKey);

        document.body.classList.toggle(
            "dark-mode",
            theme === "dark"
        );
    }

    applyTheme();

    themeButton?.addEventListener(
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
                isDark ? "dark" : "light"
            );
        }
    );

    // نمایش اولیه
    renderFavorites();

});