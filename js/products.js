// ==========================================
// محصولات فروشگاه پارس الکتریک
// ==========================================

var categories = [
    { id: "wire", name: "سیم و کابل" },
    { id: "switch", name: "کلید و پریز" },
    { id: "lamp", name: "لامپ و چراغ" },
    { id: "protection", name: "فیوز و محافظ" },
    { id: "tools", name: "ابزارآلات" },
    { id: "industrial", name: "تجهیزات برق صنعتی" },
    { id: "lighting", name: "لوازم روشنایی" },
    { id: "extension", name: "چندراهی و رابط" }
];

var products = [

    {
        id: 1,
        name: "سیم برق افشان 1.5 میلی‌متر",
        brand: "خراسان افشارنژاد",
        category: "wire",
        categoryName: "سیم و کابل",
        price: 185000,
        oldPrice: 210000,
        discount: 12,
        rating: 4.7,
        reviews: 126,
        stock: 45,
        image: "images/products/simafshan1.5.jpg",
        description: "سیم برق افشان با کیفیت مناسب برای سیم‌کشی ساختمان.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 2,
        name: "کابل برق 2 در 2.5",
        brand: "افشارنژاد",
        category: "wire",
        categoryName: "سیم و کابل",
        price: 325000,
        oldPrice: 360000,
        discount: 10,
        rating: 4.6,
        reviews: 84,
        stock: 32,
        image:"images/products/kable2.5.jpg",
        description: "کابل برق دو رشته مناسب مصارف ساختمانی و عمومی.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 3,
        name: "کلید تک پل مدل آریا",
        brand: "ایران الکتریک",
        category: "switch",
        categoryName: "کلید و پریز",
        price: 98000,
        oldPrice: 115000,
        discount: 15,
        rating: 4.5,
        reviews: 73,
        stock: 60,
        image: "images/products/klid1pol.jpeg",
        description: "کلید تک پل با طراحی ساده و مناسب استفاده در ساختمان.",
        isSpecial: false,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 4,
        name: "پریز برق ارت‌دار مدل آریا",
        brand: "ایران الکتریک",
        category: "switch",
        categoryName: "کلید و پریز",
        price: 125000,
        oldPrice: 145000,
        discount: 14,
        rating: 4.7,
        reviews: 91,
        stock: 48,
        image: "images/products/priz.jpeg",
        description: "پریز برق ارت‌دار مناسب مصارف خانگی و اداری.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 5,
        name: "لامپ LED حبابی 12 وات",
        brand: "افرا",
        category: "lamp",
        categoryName: "لامپ و چراغ",
        price: 89000,
        oldPrice: 105000,
        discount: 15,
        rating: 4.8,
        reviews: 215,
        stock: 100,
        image: "images/products/lamp12.png",
        description: "لامپ LED کم‌مصرف با نور مناسب برای استفاده خانگی.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 6,
        name: "لامپ LED حبابی 20 وات",
        brand: "افرا",
        category: "lamp",
        categoryName: "لامپ و چراغ",
        price: 135000,
        oldPrice: 155000,
        discount: 13,
        rating: 4.6,
        reviews: 142,
        stock: 75,
        image: "images/products/lamp20.png",
        description: "لامپ LED پرنور و کم‌مصرف مناسب اتاق و محیط کار.",
        isSpecial: false,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 7,
        name: "محافظ برق 6 خانه",
        brand: "پارس",
        category: "protection",
        categoryName: "فیوز و محافظ",
        price: 285000,
        oldPrice: 320000,
        discount: 11,
        rating: 4.4,
        reviews: 68,
        stock: 35,
        image: "images/products/shish.png",
        description: "محافظ برق چندخانه مناسب تجهیزات خانگی و اداری.",
        isSpecial: true,
        isBestSelling: false,
        isNew: true
    },

    {
        id: 8,
        name: "فیوز مینیاتوری تک پل 16 آمپر",
        brand: "LS",
        category: "protection",
        categoryName: "فیوز و محافظ",
        price: 175000,
        oldPrice: 195000,
        discount: 10,
        rating: 4.8,
        reviews: 112,
        stock: 80,
        image: "images/products/fyoz1pol.jpeg",
        description: "فیوز مینیاتوری تک پل مناسب تابلوهای برق ساختمان.",
        isSpecial: false,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 9,
        name: "پیچ گوشتی دوسو صنعتی",
        brand: "Ronix",
        category: "tools",
        categoryName: "ابزارآلات",
        price: 165000,
        oldPrice: 190000,
        discount: 13,
        rating: 4.7,
        reviews: 97,
        stock: 40,
        image: "images/products/pich.jpeg",
        description: "پیچ گوشتی مقاوم مناسب کارهای فنی و برق‌کاری.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 10,
        name: "انبردست صنعتی",
        brand: "Ronix",
        category: "tools",
        categoryName: "ابزارآلات",
        price: 320000,
        oldPrice: 360000,
        discount: 11,
        rating: 4.8,
        reviews: 88,
        stock: 25,
        image: "images/products/anbor.jpeg",
        description: "انبردست صنعتی با بدنه مقاوم و دسته ضدلغزش.",
        isSpecial: false,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 11,
        name: "کنتاکتور 18 آمپر",
        brand: "Schneider",
        category: "industrial",
        categoryName: "تجهیزات برق صنعتی",
        price: 1250000,
        oldPrice: 1400000,
        discount: 11,
        rating: 4.9,
        reviews: 54,
        stock: 18,
        image: "images/products/kontaktor.jpeg",
        description: "کنتاکتور صنعتی مناسب تابلوهای برق و مدارهای کنترلی.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 12,
        name: "رله حرارتی 12 تا 18 آمپر",
        brand: "Schneider",
        category: "industrial",
        categoryName: "تجهیزات برق صنعتی",
        price: 890000,
        oldPrice: 990000,
        discount: 10,
        rating: 4.7,
        reviews: 41,
        stock: 20,
        image: "images/products/rele.jpeg",
        description: "رله حرارتی برای حفاظت موتورهای الکتریکی.",
        isSpecial: false,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 13,
        name: "چراغ سقفی LED گرد 24 وات",
        brand: "اکو",
        category: "lighting",
        categoryName: "لوازم روشنایی",
        price: 420000,
        oldPrice: 490000,
        discount: 14,
        rating: 4.6,
        reviews: 76,
        stock: 34,
        image: "images/products/ledgerd.jpg",
        description: "چراغ سقفی LED با طراحی مدرن و مصرف کم.",
        isSpecial: true,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 14,
        name: "پنل LED توکار 18 وات",
        brand: "اکو",
        category: "lighting",
        categoryName: "لوازم روشنایی",
        price: 365000,
        oldPrice: 420000,
        discount: 13,
        rating: 4.7,
        reviews: 63,
        stock: 28,
        image: "images/products/panel.jpg",
        description: "پنل LED توکار مناسب منازل، فروشگاه‌ها و دفاتر.",
        isSpecial: false,
        isBestSelling: false,
        isNew: true
    },

    {
        id: 15,
        name: "چندراهی برق 4 خانه",
        brand: "پارت الکتریک",
        category: "extension",
        categoryName: "چندراهی و رابط",
        price: 245000,
        oldPrice: 275000,
        discount: 11,
        rating: 4.5,
        reviews: 119,
        stock: 55,
        image: "images/products/char.jpeg",
        description: "چندراهی برق چهار خانه مناسب تجهیزات خانگی و اداری.",
        isSpecial: true,
        isBestSelling: true,
        isNew: false
    },

    {
        id: 16,
        name: "رابط برق 5 متری",
        brand: "پارت الکتریک",
        category: "extension",
        categoryName: "چندراهی و رابط",
        price: 285000,
        oldPrice: 320000,
        discount: 11,
        rating: 4.6,
        reviews: 82,
        stock: 43,
        image: "images/products/rabet5m.jpg",
        description: "رابط برق پنج متری با کیفیت مناسب استفاده روزمره.",
        isSpecial: false,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 17,
        name: "سیم افشان 2.5 میلی‌متر",
        brand: "خراسان افشارنژاد",
        category: "wire",
        categoryName: "سیم و کابل",
        price: 275000,
        oldPrice: 310000,
        discount: 11,
        rating: 4.8,
        reviews: 103,
        stock: 50,
        image: "images/products/simaf2.5.jpeg",
        description: "سیم افشان استاندارد مناسب سیم‌کشی ساختمان.",
        isSpecial: false,
        isBestSelling: true,
        isNew: true
    },

    {
        id: 18,
        name: "چراغ کارگاهی LED",
        brand: "رونیکس",
        category: "lighting",
        categoryName: "لوازم روشنایی",
        price: 680000,
        oldPrice: 750000,
        discount: 9,
        rating: 4.6,
        reviews: 38,
        stock: 15,
        image: "images/products/kar.jpeg",
        description: "چراغ LED مناسب کارگاه، انبار و محیط‌های صنعتی.",
        isSpecial: true,
        isBestSelling: false,
        isNew: true
    },

    {
        id: 19,
        name: "پریز دو قلو ارت‌دار",
        brand: "ویرا",
        category: "switch",
        categoryName: "کلید و پریز",
        price: 210000,
        oldPrice: 245000,
        discount: 14,
        rating: 4.5,
        reviews: 57,
        stock: 31,
        image: "images/products/priz2.jpeg",
        description: "پریز دو قلو ارت‌دار با طراحی زیبا و کاربردی.",
        isSpecial: false,
        isBestSelling: false,
        isNew: true
    },

    {
        id: 20,
        name: "مولتی‌متر دیجیتال",
        brand: "UNI-T",
        category: "tools",
        categoryName: "ابزارآلات",
        price: 950000,
        oldPrice: 1050000,
        discount: 10,
        rating: 4.9,
        reviews: 134,
        stock: 22,
        image: "images/products/molty.jpeg",
        description: "مولتی‌متر دیجیتال مناسب اندازه‌گیری ولتاژ، جریان و مقاومت.",
        isSpecial: true,
        isBestSelling: true,
        isNew: true
    }
];


// ==========================================
// توابع محصولات
// ==========================================

function getProductById(id) {
    return products.find(function(product) {
        return product.id === Number(id);
    });
}

function getSpecialProducts() {
    return products.filter(function(product) {
        return product.isSpecial === true;
    });
}

function getBestSellingProducts() {
    return products.filter(function(product) {
        return product.isBestSelling === true;
    });
}

function getNewProducts() {
    return products.filter(function(product) {
        return product.isNew === true;
    });
}

function getProductsByCategory(categoryId) {
    return products.filter(function(product) {
        return product.category === categoryId;
    });
}

function searchProducts(keyword) {
    var search = String(keyword || "").trim().toLowerCase();

    if (!search) {
        return products;
    }

    return products.filter(function(product) {
        return (
            product.name.toLowerCase().includes(search) ||
            product.brand.toLowerCase().includes(search) ||
            product.categoryName.toLowerCase().includes(search)
        );
    });
}

function sortProductsLowToHigh(list) {
    return [...list].sort(function(a, b) {
        return a.price - b.price;
    });
}

function sortProductsHighToLow(list) {
    return [...list].sort(function(a, b) {
        return b.price - a.price;
    });
}

function sortProductsNewest(list) {
    return [...list].sort(function(a, b) {
        return Number(b.isNew) - Number(a.isNew);
    });
}

function sortProductsPopular(list) {
    return [...list].sort(function(a, b) {
        return b.rating - a.rating;
    });
}

function getDiscountPrice(product) {
    return product.price;
}

function formatPrice(price) {
    return Number(price).toLocaleString("fa-IR") + " تومان";
}


// ==========================================
// در دسترس قرار دادن اطلاعات برای فایل‌های دیگر
// ==========================================

window.products = products;
window.categories = categories;
window.getProductById = getProductById;
window.getSpecialProducts = getSpecialProducts;
window.getBestSellingProducts = getBestSellingProducts;
window.getNewProducts = getNewProducts;
window.getProductsByCategory = getProductsByCategory;
window.searchProducts = searchProducts;
window.sortProductsLowToHigh = sortProductsLowToHigh;
window.sortProductsHighToLow = sortProductsHighToLow;
window.sortProductsNewest = sortProductsNewest;
window.sortProductsPopular = sortProductsPopular;
window.getDiscountPrice = getDiscountPrice;
window.formatPrice = formatPrice;