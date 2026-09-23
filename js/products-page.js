document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("productsContainer");
    const countElement = document.getElementById("productsCount");

    const categoryFilters = document.getElementById("categoryFilters");
    const brandFilters = document.getElementById("brandFilters");

    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");

    const applyFilters = document.getElementById("applyFilters");
    const sortProducts = document.getElementById("sortProducts");

    if (!container) return;

    let currentProducts = [...products];

    // -----------------------------
    // گرفتن پارامترهای URL
    // -----------------------------

    const params = new URLSearchParams(window.location.search);

    const urlCategory = params.get("category");
    const urlSearch = params.get("search");

    // -----------------------------
    // ساخت فیلتر دسته‌بندی
    // -----------------------------

    if (categoryFilters) {

        categoryFilters.innerHTML = categories.map(category => `
            <label class="filter-option">
                <input
                    type="checkbox"
                    value="${category.id}"
                    data-category-filter
                    ${urlCategory === category.id ? "checked" : ""}
                >
                <span>${category.name}</span>
            </label>
        `).join("");
    }

    // -----------------------------
    // ساخت فیلتر برند
    // -----------------------------

    const brands = [
        ...new Set(products.map(product => product.brand))
    ];

    if (brandFilters) {

        brandFilters.innerHTML = brands.map(brand => `
            <label class="filter-option">
                <input
                    type="checkbox"
                    value="${brand}"
                    data-brand-filter
                >
                <span>${brand}</span>
            </label>
        `).join("");
    }

    // -----------------------------
    // اعمال فیلترها
    // -----------------------------

    function filterProducts() {

        let result = [...products];

        // جستجو
        if (urlSearch) {
            const searchText = urlSearch.toLowerCase();

            result = result.filter(product =>
                product.name.toLowerCase().includes(searchText) ||
                product.brand.toLowerCase().includes(searchText) ||
                product.categoryName.toLowerCase().includes(searchText)
            );
        }

        // دسته‌بندی
        const selectedCategories = [
            ...document.querySelectorAll("[data-category-filter]:checked")
        ].map(input => input.value);

        if (selectedCategories.length > 0) {
            result = result.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // برند
        const selectedBrands = [
            ...document.querySelectorAll("[data-brand-filter]:checked")
        ].map(input => input.value);

        if (selectedBrands.length > 0) {
            result = result.filter(product =>
                selectedBrands.includes(product.brand)
            );
        }

        // حداقل قیمت
        const min = Number(minPrice?.value || 0);

        if (min > 0) {
            result = result.filter(product =>
                getDiscountPrice(product) >= min
            );
        }

        // حداکثر قیمت
        const max = Number(maxPrice?.value || 0);

        if (max > 0) {
            result = result.filter(product =>
                getDiscountPrice(product) <= max
            );
        }

        // مرتب‌سازی
        const sortValue = sortProducts?.value || "default";

        switch (sortValue) {

            case "cheap":
                result.sort((a, b) =>
                    getDiscountPrice(a) - getDiscountPrice(b)
                );
                break;

            case "expensive":
                result.sort((a, b) =>
                    getDiscountPrice(b) - getDiscountPrice(a)
                );
                break;

            case "newest":
                result.sort((a, b) => b.id - a.id);
                break;

            case "popular":
                result.sort((a, b) => b.rating - a.rating);
                break;
        }

        currentProducts = result;

        renderProducts();
    }

    // -----------------------------
    // نمایش محصولات
    // -----------------------------

    function renderProducts() {

        if (countElement) {
            countElement.textContent =
                `${currentProducts.length} محصول`;
        }

        if (currentProducts.length === 0) {

            container.innerHTML = `
                <div class="empty-products">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>محصولی پیدا نشد</h3>
                    <p>
                        فیلترها یا عبارت جستجو را تغییر دهید.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML = currentProducts
            .map(product => createProductCard(product))
            .join("");
    }

    // -----------------------------
    // دکمه اعمال فیلتر
    // -----------------------------

    if (applyFilters) {
        applyFilters.addEventListener("click", () => {
            filterProducts();
        });
    }

    // -----------------------------
    // تغییر مرتب‌سازی
    // -----------------------------

    if (sortProducts) {
        sortProducts.addEventListener("change", () => {
            filterProducts();
        });
    }

    // -----------------------------
    // فیلتر لحظه‌ای دسته‌بندی و برند
    // -----------------------------

    document.addEventListener("change", event => {

        if (
            event.target.matches("[data-category-filter]") ||
            event.target.matches("[data-brand-filter]")
        ) {
            filterProducts();
        }
    });

    // -----------------------------
    // نمایش اولیه
    // -----------------------------

    filterProducts();
});