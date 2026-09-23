document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    const product = getProductById(productId);

    if (!product) {
        window.location.href = "products.html";
        return;
    }

    const detail = document.getElementById("productDetail");
    const description = document.getElementById("productDescription");

    const cartKey = "parsElectricCart";
    const favoriteKey = "parsElectricFavorites";
    const themeKey = "parsElectricTheme";

    let quantity = 1;

    // -----------------------------
    // اطلاعات محصول
    // -----------------------------

    const finalPrice = getDiscountPrice(product);

    detail.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-detail-info">

            <span class="product-brand">${product.brand}</span>

            <h1>${product.name}</h1>

            <div class="product-rating">
                <span class="product-stars">
                    ${"★".repeat(Math.round(product.rating))}
                    ${"☆".repeat(5 - Math.round(product.rating))}
                </span>
                <span>${product.rating} از 5</span>
                <span>(${product.reviews} نظر)</span>
            </div>

            <div class="product-detail-price">
                ${
                    product.discount > 0
                        ? `<span class="product-old-price">${formatPrice(product.price)} تومان</span>`
                        : ""
                }

                <strong>${formatPrice(finalPrice)} تومان</strong>

                ${
                    product.discount > 0
                        ? `<span class="discount-badge">${product.discount}% تخفیف</span>`
                        : ""
                }
            </div>

            <div class="product-stock">
                ${
                    product.stock > 0
                        ? `موجود در انبار (${product.stock} عدد)`
                        : "ناموجود"
                }
            </div>

            ${
                product.stock > 0
                    ? `
                    <div class="quantity-box">
                        <button id="decreaseQuantity">−</button>
                        <span id="quantityValue">1</span>
                        <button id="increaseQuantity">+</button>
                    </div>

                    <div class="product-actions">
                        <button id="addToCartButton" class="product-add">
                            <i class="fa-solid fa-cart-plus"></i>
                            افزودن به سبد خرید
                        </button>

                        <button id="favoriteButton" class="product-favorite-detail">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                    `
                    : `
                    <div class="product-unavailable">
                        این محصول در حال حاضر موجود نیست.
                    </div>
                    `
            }

        </div>
    `;

    // توضیحات
    if (description) {
        description.innerHTML = `
            <h2>توضیحات محصول</h2>
            <p>${product.description}</p>
        `;
    }

    // -----------------------------
    // سبد خرید
    // -----------------------------

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

    // -----------------------------
    // علاقه‌مندی‌ها
    // -----------------------------

    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(favoriteKey)) || [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    }

    function updateFavoriteButton() {
        const button = document.getElementById("favoriteButton");

        if (!button) return;

        const favorites = getFavorites();
        const isFavorite = favorites.includes(product.id);

        button.innerHTML = isFavorite
            ? `<i class="fa-solid fa-heart"></i>`
            : `<i class="fa-regular fa-heart"></i>`;

        button.classList.toggle("active", isFavorite);
    }

    // -----------------------------
    // تعداد محصول
    // -----------------------------

    const quantityValue = document.getElementById("quantityValue");
    const increaseButton = document.getElementById("increaseQuantity");
    const decreaseButton = document.getElementById("decreaseQuantity");

    if (increaseButton) {
        increaseButton.addEventListener("click", () => {
            if (quantity < product.stock) {
                quantity++;
                quantityValue.textContent = quantity;
            }
        });
    }

    if (decreaseButton) {
        decreaseButton.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityValue.textContent = quantity;
            }
        });
    }

    // -----------------------------
    // افزودن به سبد خرید
    // -----------------------------

    const addToCartButton = document.getElementById("addToCartButton");

    if (addToCartButton) {
        addToCartButton.addEventListener("click", () => {

            const cart = getCart();

            const existing = cart.find(item => Number(item.id) === product.id);

            if (existing) {
                existing.quantity += quantity;

                if (existing.quantity > product.stock) {
                    existing.quantity = product.stock;
                }
            } else {
                cart.push({
                    id: product.id,
                    quantity: quantity
                });
            }

            saveCart(cart);

            showToast("محصول به سبد خرید اضافه شد 🛒");
        });
    }

    // -----------------------------
    // علاقه‌مندی
    // -----------------------------

    const favoriteButton = document.getElementById("favoriteButton");

    if (favoriteButton) {
        favoriteButton.addEventListener("click", () => {

            let favorites = getFavorites();

            if (favorites.includes(product.id)) {
                favorites = favorites.filter(id => id !== product.id);
                showToast("از علاقه‌مندی‌ها حذف شد");
            } else {
                favorites.push(product.id);
                showToast("به علاقه‌مندی‌ها اضافه شد ❤️");
            }

            saveFavorites(favorites);
            updateFavoriteButton();
        });
    }

    // -----------------------------
    // پیام کوچک
    // -----------------------------

    function showToast(message) {

        let toast = document.getElementById("productToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "productToast";

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

        clearTimeout(window.productToastTimer);

        window.productToastTimer = setTimeout(() => {
            toast.style.display = "none";
        }, 2500);
    }

    // -----------------------------
    // حالت تاریک
    // -----------------------------

    const themeButton = document.getElementById("themeToggle");

    function applyTheme() {
        const theme = localStorage.getItem(themeKey);

        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }

    applyTheme();

    if (themeButton) {
        themeButton.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const dark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                themeKey,
                dark ? "dark" : "light"
            );
        });
    }

    updateFavoriteButton();
});