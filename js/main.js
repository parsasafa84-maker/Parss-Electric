// ==========================================
// MAIN.JS - پارس الکتریک
// ==========================================


// ==========================================
// Local Storage
// ==========================================

const CART_KEY = "parsElectricCart";
const FAVORITES_KEY = "parsElectricFavorites";
const THEME_KEY = "parsElectricTheme";


// ==========================================
// سبد خرید
// ==========================================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateHeaderCounts();
}

function addToCart(productId, quantity) {

    quantity = quantity || 1;

    const cart = getCart();
    const existing = cart.find(item => Number(item.id) === Number(productId));

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: Number(productId),
            quantity: quantity
        });
    }

    saveCart(cart);

    showToast("محصول به سبد خرید اضافه شد");
}

function removeFromCart(productId) {

    const cart = getCart().filter(
        item => Number(item.id) !== Number(productId)
    );

    saveCart(cart);
}


// ==========================================
// علاقه‌مندی‌ها
// ==========================================

function getFavorites() {

    try {
        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}

function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

    updateHeaderCounts();
}

function isFavorite(productId) {

    return getFavorites().some(
        id => Number(id) === Number(productId)
    );
}

function toggleFavorite(productId) {

    let favorites = getFavorites();

    const index = favorites.findIndex(
        id => Number(id) === Number(productId)
    );

    if (index >= 0) {

        favorites.splice(index, 1);

        showToast("از علاقه‌مندی‌ها حذف شد");

    } else {

        favorites.push(Number(productId));

        showToast("به علاقه‌مندی‌ها اضافه شد");
    }

    saveFavorites(favorites);

    refreshProductCards();
}


// ==========================================
// شمارنده‌های هدر
// ==========================================

function updateHeaderCounts() {

    const cart = getCart();

    const cartCount = cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
    );

    const favoritesCount = getFavorites().length;

    const cartElement =
        document.getElementById("cartCount");

    const mobileCartElement =
        document.getElementById("mobileCartCount");

    const wishlistElement =
        document.getElementById("wishlistCount");

    if (cartElement) {
        cartElement.textContent = cartCount;
    }

    if (mobileCartElement) {
        mobileCartElement.textContent = cartCount;
    }

    if (wishlistElement) {
        wishlistElement.textContent = favoritesCount;
    }
}


// ==========================================
// ساخت کارت محصول
// ==========================================

function createProductCard(product) {

    if (!product) {
        return "";
    }

    const favorite = isFavorite(product.id);

    const discount = Number(product.discount || 0);

    const oldPrice = Number(product.oldPrice || 0);

    const currentPrice = Number(
        product.price || 0
    );

    const stock = Number(
        product.stock || 0
    );

    const stars = createStars(
        Number(product.rating || 0)
    );

    return `
        <article class="product-card"
            data-product-id="${product.id}">

            <div class="product-image">

                ${
                    discount > 0
                    ? `
                        <span class="product-discount">
                            ${discount}٪
                        </span>
                    `
                    : ""
                }

                <button
                    type="button"
                    class="product-favorite ${favorite ? "active" : ""}"
                    onclick="toggleFavorite(${product.id})"
                    aria-label="افزودن به علاقه‌مندی">

                    <i class="${
                        favorite
                        ? "fa-solid fa-heart"
                        : "fa-regular fa-heart"
                    }"></i>

                </button>

                <a href="product.html?id=${product.id}">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/500x400?text=Pars+Electric'"
                    >

                </a>

            </div>


            <div class="product-body">

                <div class="product-brand">
                    ${product.brand}
                </div>


                <a
                    href="product.html?id=${product.id}"
                    class="product-title">

                    ${product.name}

                </a>


                <div class="product-rating">

                    <span class="product-stars">
                        ${stars}
                    </span>

                    <span class="product-reviews">
                        (${Number(product.reviews || 0)})
                    </span>

                </div>


                <div class="product-price">

                    ${
                        oldPrice > currentPrice
                        ? `
                            <span class="product-old-price">
                                ${formatPrice(oldPrice)}
                            </span>
                        `
                        : ""
                    }

                    <span class="product-current-price">
                        ${formatPrice(currentPrice)}
                    </span>

                </div>


                <div class="product-stock">

                    ${
                        stock > 0
                        ? `موجودی: ${stock} عدد`
                        : "ناموجود"
                    }

                </div>


                <button
                    type="button"
                    class="product-add"
                    onclick="addToCart(${product.id})"
                    ${stock <= 0 ? "disabled" : ""}>

                    <i class="fa-solid fa-cart-plus"></i>

                    ${
                        stock > 0
                        ? "افزودن به سبد خرید"
                        : "ناموجود"
                    }

                </button>

            </div>

        </article>
    `;
}


// ==========================================
// ستاره‌های امتیاز
// ==========================================

function createStars(rating) {

    let result = "";

    const fullStars = Math.floor(rating);

    const hasHalf =
        rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {

        result +=
            '<i class="fa-solid fa-star"></i>';
    }

    if (hasHalf && fullStars < 5) {

        result +=
            '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    const emptyStars =
        5 - fullStars - (hasHalf ? 1 : 0);

    for (let i = 0; i < emptyStars; i++) {

        result +=
            '<i class="fa-regular fa-star"></i>';
    }

    return result;
}


// ==========================================
// نمایش محصولات صفحه اصلی
// ==========================================

function renderHomeProducts() {

    const specialContainer =
        document.getElementById("specialProducts");

    const bestContainer =
        document.getElementById("bestSellingProducts");

    const newContainer =
        document.getElementById("newProducts");


    if (specialContainer) {

        specialContainer.innerHTML =
            getSpecialProducts()
                .slice(0, 8)
                .map(createProductCard)
                .join("");
    }


    if (bestContainer) {

        bestContainer.innerHTML =
            getBestSellingProducts()
                .slice(0, 8)
                .map(createProductCard)
                .join("");
    }


    if (newContainer) {

        newContainer.innerHTML =
            getNewProducts()
                .slice(0, 8)
                .map(createProductCard)
                .join("");
    }
}


// ==========================================
// به‌روزرسانی کارت‌ها
// ==========================================

function refreshProductCards() {

    const container =
        document.getElementById("productsContainer");

    if (container && typeof currentProducts !== "undefined") {
        return;
    }

    renderHomeProducts();
}


// ==========================================
// Toast
// ==========================================

function showToast(message) {

    let toast =
        document.getElementById("parsToast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "parsToast";

        toast.style.position = "fixed";
        toast.style.bottom = "25px";
        toast.style.right = "25px";
        toast.style.zIndex = "99999";
        toast.style.background = "#101828";
        toast.style.color = "#fff";
        toast.style.padding = "14px 22px";
        toast.style.borderRadius = "10px";
        toast.style.fontSize = "14px";
        toast.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.2)";
        toast.style.transition =
            "opacity .3s";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.opacity = "1";

    clearTimeout(window.parsToastTimer);

    window.parsToastTimer =
        setTimeout(() => {
            toast.style.opacity = "0";
        }, 2200);
}


// ==========================================
// حالت تاریک
// ==========================================

function loadTheme() {

    const theme =
        localStorage.getItem(THEME_KEY);

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );
    }

    updateThemeIcon();
}


function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

    localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
    );

    updateThemeIcon();
}


function updateThemeIcon() {

    const button =
        document.getElementById("themeToggle");

    if (!button) {
        return;
    }

    const icon =
        button.querySelector("i");

    if (!icon) {
        return;
    }

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

    icon.className = isDark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
}


// ==========================================
// جستجو
// ==========================================

function setupSearch() {

    const input =
        document.getElementById("searchInput");

    const button =
        document.getElementById("searchButton");

    if (!input) {
        return;
    }


    function doSearch() {

        const value =
            input.value.trim();

        if (!value) {
            return;
        }

        window.location.href =
            "products.html?search=" +
            encodeURIComponent(value);
    }


    if (button) {

        button.addEventListener(
            "click",
            doSearch
        );
    }


    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                doSearch();
            }
        }
    );
}


// ==========================================
// اجرای اولیه
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateHeaderCounts();

        loadTheme();

        setupSearch();

        const themeButton =
            document.getElementById("themeToggle");

        if (themeButton) {

            themeButton.addEventListener(
                "click",
                toggleTheme
            );
        }

        renderHomeProducts();
    }
);


// ==========================================
// دسترسی فایل‌های دیگر
// ==========================================

window.getCart = getCart;
window.saveCart = saveCart;

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

window.getFavorites = getFavorites;
window.saveFavorites = saveFavorites;

window.isFavorite = isFavorite;
window.toggleFavorite = toggleFavorite;

window.updateHeaderCounts = updateHeaderCounts;

window.createProductCard = createProductCard;
window.createStars = createStars;

window.showToast = showToast;

window.toggleTheme = toggleTheme;