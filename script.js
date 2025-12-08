// ==========================================================================
// 1. MOCK DATA & STATE MANAGEMENT
// ==========================================================================

const menuItems = [
    {
        id: 1,
        name: "Classic Burger",
        category: "burger",
        price: 149,
        image: "./assets/burger1.jpeg",
    },
    {
        id: 2,
        name: "Cheese Meltdown Burger",
        category: "burger",
        price: 199,
        image: "./assets/burger2.jpeg",
    },
    {
        id: 3,
        name: "Pepperoni Pizza",
        category: "pizza",
        price: 399,
        image: "./assets/pizza1.jpeg",
    },
    {
        id: 4,
        name: "Veggie Supreme Pizza",
        category: "pizza",
        price: 349,
        image: "./assets/pizza2.jpeg",
    },
    {
        id: 5,
        name: "Chicken Biryani",
        category: "biryani",
        price: 299,
        image: "./assets/biryani1.jpeg",
    },
    {
        id: 6,
        name: "Hyderabadi Veg Biryani",
        category: "biryani",
        price: 249,
        image: "./assets/biryani2.jpeg",
    },
    {
        id: 7,
        name: "Veg Meal",
        category: "meal",
        price: 450,
        image: "./assets/meal1.jpeg",
    },
    {
        id: 8,
        name: "Punjabi Meal",
        category: "meal",
        price: 280,
        image: "./assets/meal2.jpeg",
    },
    {
        id: 9,
        name: "Fried Chicken",
        category: "fastfood",
        price: 599,
        image: "./assets/fastf1.jpeg",
    },
    {
        id: 10,
        name: "Chicken Sauce",
        category: "fastfood",
        price: 499,
        image: "./assets/fastf2.jpeg",
    },
    {
        id: 11,
        name: "Club Sandwich",
        category: "sandwich",
        price: 129,
        image: "./assets/sand1.jpeg",
    },
    {
        id: 12,
        name: "Grilled Cheese Sandwich",
        category: "sandwich",
        price: 99,
        image: "./assets/sand2.jpeg",
    },
    {
        id: 13,
        name: "Samosa",
        category: "snacks",
        price: 89,
        image: "./assets/snacks1.jpeg",
    },
    {
        id: 14,
        name: "Kachori",
        category: "snacks",
        price: 99,
        image: "./assets/snacks2.jpeg",
    },
    {
        id: 15,
        name: "Cocktail",
        category: "beverages",
        price: 150,
        image: "./assets/bev1.jpeg",
    },
    {
        id: 16,
        name: "Cola",
        category: "beverages",
        price: 120,
        image: "./assets/bev2.jpeg",
    },
];

// Initialize Menu from LocalStorage if available
if (!localStorage.getItem("MENU_ITEMS")) {
    localStorage.setItem("MENU_ITEMS", JSON.stringify(menuItems));
}

// Global State
let cart = JSON.parse(localStorage.getItem("CART")) || [];
let currentUser = JSON.parse(localStorage.getItem("CURRENT_USER")) || null;
let discount = 0;
let currentChatOrder = null;
let lastChatCheck = Date.now();
let selectedPaymentMethod = null;
let selectedAddressId = null;

// DOM Elements
let menuContainer,
    cartItemsContainer,
    cartTotalElement,
    cartCountElement,
    sidebar,
    overlay,
    authModal,
    loginForm;

// Categories
const defaultCategories = [
    { id: "burger", name: "Burger" },
    { id: "pizza", name: "Pizza" },
    { id: "biryani", name: "Biryani" },
    { id: "meal", name: "Meal" },
    { id: "fastfood", name: "Fast Food" },
    { id: "sandwich", name: "Sandwich" },
    { id: "snacks", name: "Snacks" },
    { id: "beverages", name: "Beverages" },
];

function getCategories() {
    return JSON.parse(localStorage.getItem("CATEGORIES")) || defaultCategories;
}

function getGlobalSettings() {
    return (
        JSON.parse(localStorage.getItem("GLOBAL_SETTINGS")) || {
            extraCharges: [],
            globalOffer: { active: false, name: "", type: "percent", value: 0 },
            promoCodes: [],
        }
    );
}

function updateGlobalSettings(settings) {
    localStorage.setItem("GLOBAL_SETTINGS", JSON.stringify(settings));
}

function addCategory(name) {
    const categories = getCategories();
    const id = name.toLowerCase().replace(/\s+/g, "");
    if (categories.find((c) => c.id === id))
        return showToast("Category already exists");
    categories.push({ id, name });
    localStorage.setItem("CATEGORIES", JSON.stringify(categories));
    showToast("Category Added");
    loadCategoriesSection(); // Refresh Admin
}

function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    let categories = getCategories();
    categories = categories.filter((c) => c.id !== id);
    localStorage.setItem("CATEGORIES", JSON.stringify(categories));
    showToast("Category Deleted");
    loadCategoriesSection(); // Refresh Admin
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load Components
    // await loadAllComponents(); // Disabled: Components are now hardcoded in HTML files

    // 2. Initialize Global Elements
    initializeGlobalElements();

    // 3. Theme Check
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        const icon = document.querySelector("#theme-toggle .material-icons");
        if (icon) icon.textContent = "light_mode";
    }

    // 4. Core Logic Init
    if (typeof checkLoginState === "function") checkLoginState();
    if (typeof updateCartUI === "function") updateCartUI();
    if (typeof renderCategoryFilters === "function") renderCategoryFilters();
    if (menuContainer && typeof renderMenu === "function") renderMenu();

    // 5. Page Specific Init
    if (typeof checkAdminLogin === "function") checkAdminLogin();

    if (currentUser) {
        addGlobalChatButton();
        startChatPolling();
    }

    if (window.location.href.includes("payment.html")) {
        loadPaymentSummary();
        loadPaymentAddresses();
    }

    if (window.location.href.includes("profile.html")) {
        loadProfileData();
    }

    if (window.location.href.includes("contact.html")) {
        initContactPageChat();
    }

    if (window.location.href.includes("tracker.html")) {
        initTracker();
    }

    if (document.getElementById("address-list")) {
        loadAddresses();
    }
});

async function loadAllComponents() {
    console.log("Starting loadAllComponents...");
    const components = [
        { id: "navbar-placeholder", path: "./elements/navbar.html" },
        { id: "footer-placeholder", path: "./elements/footer.html" },
        {
            id: "cart-sidebar-placeholder",
            path: "./elements/cart-sidebar.html",
        },
        { id: "auth-modal-placeholder", path: "./elements/auth-modal.html" },
        { id: "chat-modal-placeholder", path: "./elements/chat-modal.html" },
    ];

    for (const c of components) {
        await loadComponent(c.id, c.path);
    }
    console.log("All components loaded.");
}

async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with ID ${elementId} not found.`);
        return;
    }
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            element.innerHTML = await response.text();
            console.log(`Loaded ${filePath} into ${elementId}`);
        } else {
            console.error(
                `Failed to load ${filePath}: ${response.status} ${response.statusText}`
            );
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

function initializeGlobalElements() {
    menuContainer = document.getElementById("menu-container");
    cartItemsContainer = document.getElementById("cart-items");
    cartTotalElement = document.getElementById("cart-total");
    cartCountElement = document.getElementById("cart-count");
    sidebar = document.getElementById("cart-sidebar");
    overlay = document.getElementById("overlay");
    authModal = document.getElementById("auth-modal");
    loginForm = document.getElementById("login-form");
    signupForm = document.getElementById("signup-form");
    tabLogin = document.getElementById("tab-login");
    tabSignup = document.getElementById("tab-signup");
}

// ==========================================================================
// 3. UTILITIES & UI HELPERS
// ==========================================================================

function formatPrice(amount) {
    return amount.toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

function calculateItemPrice(item) {
    let price = item.price;
    let originalPrice = item.price;
    let hasDiscount = false;

    if (item.offer && item.offer.type !== "none") {
        if (item.offer.type === "percent") {
            price = Math.round(item.price * (1 - item.offer.value / 100));
        } else if (item.offer.type === "flat") {
            price = Math.max(0, item.price - item.offer.value);
        }
        hasDiscount = true;
    }
    return { price, originalPrice, hasDiscount };
}

function showToast(message) {
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleMobileMenu() {
    document.getElementById("nav-links").classList.toggle("active");
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const icon = document.querySelector("#theme-toggle .material-icons");
    if (document.body.classList.contains("dark-mode")) {
        icon.textContent = "light_mode";
        localStorage.setItem("theme", "dark");
    } else {
        icon.textContent = "dark_mode";
        localStorage.setItem("theme", "light");
    }
}

function toggleCart() {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

function openCart() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

function openLogin() {
    if (authModal) authModal.classList.add("active");
}

function closeLogin() {
    if (authModal) authModal.classList.remove("active");
}

function switchTab(tab) {
    if (tab === "login") {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
    } else {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
        tabLogin.classList.remove("active");
        tabSignup.classList.add("active");
    }
}

// ==========================================================================
// 4. AUTHENTICATION
// ==========================================================================

function updateMasterUserList(userObj) {
    let users = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const index = users.findIndex((u) => u.email === userObj.email);
    if (index !== -1) users[index] = userObj;
    else users.push(userObj);
    localStorage.setItem("ALL_USERS", JSON.stringify(users));
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.querySelector(
        '#login-form input[type="email"]'
    ).value;
    const pass = document.querySelector(
        '#login-form input[type="password"]'
    ).value;

    let users = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const user = users.find((u) => u.email === email && u.password === pass);

    if (user) {
        currentUser = user;
        localStorage.setItem("CURRENT_USER", JSON.stringify(user));
        showToast(`Welcome back, ${user.name}!`);
        closeLogin();
        checkLoginState();
        if (window.location.href.includes("profile.html")) loadProfileData();
    } else {
        showToast("Invalid Email or Password");
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.querySelector(
        '#signup-form input[type="text"]'
    ).value;
    const email = document.querySelector(
        '#signup-form input[type="email"]'
    ).value;
    const pass = document.querySelector(
        '#signup-form input[type="password"]'
    ).value;

    let users = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    if (users.find((u) => u.email === email)) {
        showToast("Email already exists!");
        return;
    }

    const newUser = {
        name,
        email,
        password: pass,
        phone: "",
        address: "",
        orders: [],
        favorites: [],
    };
    users.push(newUser);
    localStorage.setItem("ALL_USERS", JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem("CURRENT_USER", JSON.stringify(newUser));
    showToast("Account Created!");
    closeLogin();
    checkLoginState();
}

function checkLoginState() {
    const navAction = document.getElementById("user-action-area");
    if (!navAction) return;

    if (currentUser) {
        navAction.innerHTML = `
            <div class="nav-user-badge" onclick="window.location.href='profile.html'" title="My Profile">
                <span class="material-icons">person</span>
            </div>
        `;
    } else {
        navAction.innerHTML = `<button class="login-btn" onclick="openLogin()">Login</button>`;
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem("CURRENT_USER");
    window.location.href = "index.html";
}

// ==========================================================================
// 5. MENU & CART LOGIC
// ==========================================================================

function getMenuItems() {
    return JSON.parse(localStorage.getItem("MENU_ITEMS")) || menuItems;
}

function renderMenu(items = getMenuItems()) {
    if (!menuContainer) return;
    const userFavs = currentUser ? currentUser.favorites : [];

    menuContainer.innerHTML = items
        .map((item) => {
            const isFav = userFavs.includes(item.id) ? "active" : "";
            const heartIcon = userFavs.includes(item.id)
                ? "favorite"
                : "favorite_border";

            return `
        <div class="food-card">
            <div class="fav-btn ${isFav}" onclick="toggleFavorite(${item.id})">
                <i class="material-icons">${heartIcon}</i>
            </div>
            <div style="cursor: pointer;">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="food-info">
                    <h3>${item.name}</h3>
                    <p class="price">
                        ${(() => {
                            const { price, originalPrice, hasDiscount } =
                                calculateItemPrice(item);
                            return hasDiscount
                                ? `<span style="text-decoration: line-through; color: #999; font-size: 0.9em;">₹${formatPrice(
                                      originalPrice
                                  )}</span> ₹${formatPrice(price)}`
                                : `₹${formatPrice(price)}`;
                        })()}
                    </p>
                </div>
            </div>
            <div style="padding: 0 15px 15px;">
                <button class="add-btn" onclick="addToCart(${
                    item.id
                })">Quick Add</button>
            </div>
        </div>`;
        })
        .join("");
}

function filterMenu(category) {
    if (!menuContainer) return;
    if (category === "favorites" && !currentUser) {
        showToast("Please Login to view Favorites");
        return;
    }

    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
        const btnCat = btn.textContent.toLowerCase().replace(/\s/g, "");
        if (
            btnCat === category ||
            (category === "all" && btn.textContent === "All")
        )
            btn.classList.add("active");
    });

    let items = getMenuItems();
    if (category === "favorites") {
        items = items.filter((i) => currentUser.favorites.includes(i.id));
    } else if (category !== "all") {
        items = items.filter((i) => i.category === category);
    }
    renderMenu(items);
}

function renderCategoryFilters() {
    const container = document.querySelector(".category-filters");
    if (!container) return;

    const categories = getCategories();
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCat = activeBtn
        ? activeBtn.textContent.trim().toLowerCase()
        : "all";

    let html = `<button class="filter-btn ${
        activeCat === "all" ? "active" : ""
    }" onclick="filterMenu('all')">All</button>`;
    html += `<button class="filter-btn ${
        activeCat === "favorites" ? "active" : ""
    }" onclick="filterMenu('favorites')">Favorites</button>`;

    html += categories
        .map(
            (cat) => `
        <button class="filter-btn ${
            activeCat === cat.name.toLowerCase() ? "active" : ""
        }" onclick="filterMenu('${cat.id}')">
            ${cat.name}
        </button>
    `
        )
        .join("");

    container.innerHTML = html;
}

function searchMenu() {
    if (!menuContainer) return;
    const query = document.getElementById("search-input").value.toLowerCase();
    const items = getMenuItems().filter((i) =>
        i.name.toLowerCase().includes(query)
    );
    renderMenu(items);
}

function toggleFavorite(id) {
    if (!currentUser) return showToast("Login to save Favorites!");
    const index = currentUser.favorites.indexOf(id);
    if (index === -1) {
        currentUser.favorites.push(id);
        showToast("Added to Favorites ❤️");
    } else {
        currentUser.favorites.splice(index, 1);
        showToast("Removed from Favorites");
    }
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);

    // Refresh UI if necessary
    const activeBtn = document.querySelector(".filter-btn.active");
    if (activeBtn) {
        const category = activeBtn.textContent.toLowerCase().replace(/\s/g, "");
        filterMenu(category);
    }
    if (window.location.href.includes("profile.html")) loadProfileData();
}

function addToCart(id) {
    const items = getMenuItems();
    const item = items.find((p) => p.id === id);
    const existingItem = cart.find((i) => i.id === id);
    if (existingItem) existingItem.quantity++;
    else cart.push({ ...item, quantity: 1 });
    saveCart();
    updateCartUI();
    openCart();
    showToast(`Added ${item.name}!`);
}

function changeQty(id, action) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    if (action === "plus") item.quantity++;
    else {
        item.quantity--;
        if (item.quantity < 1) return removeFromCart(id);
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem("CART", JSON.stringify(cart));
}

function updateCartUI() {
    if (cartItemsContainer) {
        if (cart.length === 0)
            cartItemsContainer.innerHTML =
                '<p class="empty-msg">Your cart is empty.</p>';
        else {
            cartItemsContainer.innerHTML = cart
                .map((item) => {
                    const { price, originalPrice, hasDiscount } =
                        calculateItemPrice(item);
                    return `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>
                            ${
                                hasDiscount
                                    ? `<span style="text-decoration: line-through; color: #999; font-size: 0.8em;">₹${formatPrice(
                                          originalPrice
                                      )}</span> `
                                    : ""
                            }
                            ₹${formatPrice(price)} x ${item.quantity}
                        </p>
                    </div>
                    <div class="qty-controls">
                        <button onclick="changeQty(${
                            item.id
                        }, 'minus')">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${
                            item.id
                        }, 'plus')">+</button>
                    </div>
                    <span class="remove-btn" onclick="removeFromCart(${
                        item.id
                    })"><span class="material-icons">delete</span></span>
                </div>
            `;
                })
                .join("");
        }
    }

    const subtotal = cart.reduce((sum, item) => {
        const { price } = calculateItemPrice(item);
        return sum + price * item.quantity;
    }, 0);

    const settings = getGlobalSettings();

    // Global Offer
    let globalDiscount = 0;
    if (settings.globalOffer && settings.globalOffer.active) {
        if (settings.globalOffer.type === "percent") {
            globalDiscount = Math.round(
                subtotal * (settings.globalOffer.value / 100)
            );
        } else {
            globalDiscount = settings.globalOffer.value;
        }
    }

    // Calculate Charges
    let chargesTotal = 0;
    const taxableAmount = Math.max(0, subtotal - globalDiscount); // Charges on discounted amount? Usually yes.

    (settings.extraCharges || []).forEach((charge) => {
        if (charge.type === "percent") {
            chargesTotal += Math.round(taxableAmount * (charge.value / 100));
        } else {
            chargesTotal += charge.value;
        }
    });

    const finalTotal = taxableAmount + chargesTotal;

    // Update Summary Elements
    if (document.getElementById("summary-subtotal"))
        document.getElementById("summary-subtotal").innerText =
            formatPrice(subtotal);

    // We might need to dynamically render charges in the cart sidebar if we want full detail,
    // but for now let's just show the total. The detailed breakdown is in Payment page.

    if (cartTotalElement)
        cartTotalElement.textContent = formatPrice(
            finalTotal < 0 ? 0 : finalTotal
        );
    if (cartCountElement)
        cartCountElement.textContent = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
}

function applyPromo() {
    const input = document.getElementById("promo-input");
    const code = input.value.trim().toUpperCase();
    if (!code) return showToast("Please enter a code");

    const settings = getGlobalSettings();
    const promo = (settings.promoCodes || []).find((p) => p.code === code);

    // Calculate subtotal for percentage calculation
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (promo) {
        if (promo.type === "percent") {
            discount = Math.floor(subtotal * (promo.value / 100));
            showToast(`Promo Applied: ${promo.value}% Off!`);
        } else {
            discount = promo.value;
            showToast(`Promo Applied: ₹${promo.value} Off!`);
        }
    } else if (code === "TASTY10") {
        // Keep hardcoded fallback for demo
        discount = Math.floor(subtotal * 0.1);
        showToast("Promo Applied: 10% Off!");
    } else if (code === "SAVE50") {
        // Keep hardcoded fallback for demo
        discount = 50;
        showToast("Promo Applied: ₹50 Off!");
    } else {
        discount = 0;
        showToast("Invalid Promo Code");
    }

    updateCartUI();
    if (window.location.href.includes("payment.html")) {
        loadPaymentSummary();
    }
}

function checkout() {
    if (cart.length === 0) return showToast("Cart is empty!");
    if (!currentUser) {
        showToast("Please Login to Place Order");
        openLogin();
        return;
    }
    const total = document.getElementById("cart-total").textContent;
    localStorage.setItem("cartTotal", total);
    window.location.href = "payment.html";
}

// ==========================================================================
// 6. PROFILE & ORDERS
// ==========================================================================

function switchProfileTab(tabName) {
    document
        .querySelectorAll(".profile-tab")
        .forEach((t) => t.classList.remove("active"));
    document.getElementById(`tab-${tabName}`).classList.add("active");
    document
        .querySelectorAll(".profile-menu li")
        .forEach((l) => l.classList.remove("active"));

    // Map tab to menu index (simple approach)
    const tabIndex = { info: 0, orders: 1, favorites: 2, addresses: 3 };
    if (tabIndex[tabName] !== undefined) {
        document
            .querySelectorAll(".profile-menu li")
            [tabIndex[tabName]].classList.add("active");
    }
    if (tabName === "addresses") renderProfileAddresses();
}

function loadProfileData() {
    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    // Info
    document.getElementById("profile-name").innerText = currentUser.name;
    document.getElementById("profile-email").innerText = currentUser.email;
    document.getElementById("edit-name").value = currentUser.name;
    document.getElementById("edit-phone").value = currentUser.phone || "";
    document.getElementById("edit-email").value = currentUser.email;

    // Orders
    const ordersList = document.getElementById("orders-list");
    if (currentUser.orders.length === 0) {
        ordersList.innerHTML = "<p>No orders yet.</p>";
    } else {
        ordersList.innerHTML = currentUser.orders
            .slice()
            .reverse()
            .map(
                (order) => `
            <div class="order-card">
                <div class="order-header">
                    <span>Order #${order.id}</span>
                    <span class="order-status ${
                        order.status === "Processing"
                            ? "processing"
                            : "delivered"
                    }">${order.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <div>
                        <p style="font-weight: 500;">${
                            order.items.length
                        } Items | Total: ${order.total}</p>
                        <p style="font-size:0.8rem; color:#888;">${
                            order.date
                        }</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="cta-button" onclick="openChat('${
                            order.id
                        }', '${
                    currentUser.email
                }')" style="width: auto; padding: 8px 20px; font-size: 0.9rem; background: #17a2b8;">Chat</button>
                        <button class="cta-button" onclick="trackSpecificOrder('${
                            order.id
                        }')" style="width: auto; padding: 8px 20px; font-size: 0.9rem;">Track</button>
                        <button class="cta-button" onclick="deleteUserOrder('${
                            order.id
                        }')" style="width: auto; padding: 8px 20px; font-size: 0.9rem; background: #ff4757;"><i class="material-icons" style="font-size: 1.1rem;">delete</i></button>
                    </div>
                </div>
            </div>
        `
            )
            .join("");
    }

    // Favorites
    const favGrid = document.getElementById("fav-grid");
    if (!currentUser.favorites || currentUser.favorites.length === 0) {
        favGrid.innerHTML = "<p>No favorites yet.</p>";
    } else {
        const favItems = menuItems.filter((item) =>
            currentUser.favorites.includes(item.id)
        );
        favGrid.innerHTML = favItems
            .map(
                (item) => `
            <div class="food-card" style="box-shadow: none; border: 1px solid var(--border-color);">
                <div class="fav-btn active" onclick="toggleFavorite(${
                    item.id
                })" style="top:10px; right:10px;">
                    <i class="material-icons">favorite</i>
                </div>
                <img src="${item.image}" alt="${
                    item.name
                }" style="height:150px;">
                <div class="food-info" style="padding:10px;">
                    <h3 style="font-size:1rem;">${item.name}</h3>
                    <p class="price">₹${formatPrice(item.price)}</p>
                    <button class="add-btn" onclick="addToCart(${
                        item.id
                    })" style="padding:5px; margin-top:5px;">Add</button>
                </div>
            </div>
        `
            )
            .join("");
    }
}

function updateProfile() {
    currentUser.name = document.getElementById("edit-name").value;
    currentUser.phone = document.getElementById("edit-phone").value;
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Profile Updated!");
    document.getElementById("profile-name").innerText = currentUser.name;
}

function deleteUserOrder(orderId) {
    if (
        !confirm(
            "Are you sure you want to delete this order from your history?"
        )
    )
        return;
    if (!currentUser) return;
    currentUser.orders = currentUser.orders.filter((o) => o.id !== orderId);
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Order removed from history");
    loadProfileData();
}

// ==========================================================================
// 7. TRACKER LOGIC
// ==========================================================================

function trackSpecificOrder(orderId) {
    if (!currentUser) return;
    const order = currentUser.orders.find((o) => o.id === orderId);
    if (order) {
        localStorage.setItem("ACTIVE_ORDER", JSON.stringify(order));
        window.location.href = "tracker.html";
    }
}

function initTracker() {
    let activeOrderParams = JSON.parse(localStorage.getItem("ACTIVE_ORDER"));
    if (!activeOrderParams || !currentUser) {
        window.location.href = "menu.html";
        return;
    }

    // Refresh user data
    currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
    const realOrderData = currentUser.orders.find(
        (o) => o.id === activeOrderParams.id
    );
    if (!realOrderData) return console.error("Order not found in history");

    document.getElementById(
        "order-id-display"
    ).innerText = `Order ID: #${realOrderData.id}`;
    document.getElementById(
        "order-status-text"
    ).innerText = `Current Status: ${realOrderData.status}`;
    document.getElementById(
        "tracker-total-price"
    ).innerText = `₹${realOrderData.total}`;

    const itemsContainer = document.getElementById("tracker-items");
    itemsContainer.innerHTML = realOrderData.items
        .map(
            (item) => `
        <div class="tracker-item">
            <span>${item.quantity}x ${item.name}</span>
            <span>₹${formatPrice(item.price * item.quantity)}</span>
        </div>
    `
        )
        .join("");

    const statusMap = {
        Processing: 1,
        Preparing: 2,
        "Out for Delivery": 3,
        Delivered: 4,
    };
    const currentStep = statusMap[realOrderData.status] || 1;
    updateTrackerStepper(currentStep);

    const orderTime = realOrderData.timestamp;
    const arrivalTime = new Date(orderTime + 45 * 60000);
    document.getElementById("eta-time").innerText =
        arrivalTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
}

function updateTrackerStepper(currentStep) {
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById(`step-${i}`);
        if (!el) return;
        el.classList.remove("current-item", "completed");
        if (i < currentStep) el.classList.add("completed");
        else if (i === currentStep) el.classList.add("current-item");
    }
}

// ==========================================================================
// 8. PAYMENT & ADDRESS
// ==========================================================================

function loadPaymentSummary() {
    const cart = JSON.parse(localStorage.getItem("CART")) || [];
    const container = document.getElementById("payment-items"); // Updated ID
    const totalEl = document.getElementById("payment-total");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty</p>";
        if (totalEl) totalEl.innerText = "0";
        return;
    }

    // Render Items
    container.innerHTML = cart
        .map((item) => {
            const { price, originalPrice, hasDiscount } =
                calculateItemPrice(item);
            return `
        <div class="payment-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>
                ${
                    hasDiscount
                        ? `<span style="text-decoration: line-through; color: #999; font-size: 0.8em;">₹${formatPrice(
                              originalPrice * item.quantity
                          )}</span> `
                        : ""
                }
                ₹${formatPrice(price * item.quantity)}
            </span>
        </div>
    `;
        })
        .join("");

    // Calculate Subtotal
    const subtotal = cart.reduce((sum, item) => {
        const { price } = calculateItemPrice(item);
        return sum + price * item.quantity;
    }, 0);

    const settings = getGlobalSettings();

    // 1. Global Offer
    let globalDiscount = 0;
    if (settings.globalOffer && settings.globalOffer.active) {
        if (settings.globalOffer.type === "percent") {
            globalDiscount = Math.round(
                subtotal * (settings.globalOffer.value / 100)
            );
        } else {
            globalDiscount = settings.globalOffer.value;
        }
    }

    // 2. Promo Code
    let promoDiscount = 0;
    // 'discount' is a global variable from script.js (needs to be ensured it exists/is accessible)
    if (typeof discount !== "undefined" && discount > 0) {
        promoDiscount = discount;
    }

    const totalDiscount = globalDiscount + promoDiscount;
    const taxableAmount = Math.max(0, subtotal - totalDiscount);

    // 3. Extra Charges
    let chargesTotal = 0;
    let chargesHtml = "";
    (settings.extraCharges || []).forEach((charge) => {
        let amount = 0;
        if (charge.type === "percent") {
            amount = Math.round(taxableAmount * (charge.value / 100));
        } else {
            amount = charge.value;
        }
        chargesTotal += amount;
        chargesHtml += `
            <div class="bill-row">
                <span>${charge.name}</span>
                <span>₹${formatPrice(amount)}</span>
            </div>
        `;
    });

    const finalTotal = taxableAmount + chargesTotal;

    // Update UI Elements
    const subtotalEl = document.getElementById("summary-subtotal"); // Updated ID
    if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);

    // Update Discount UI
    const discountRow = document.getElementById("summary-discount-row"); // Updated ID
    const discountEl = document.getElementById("summary-discount"); // Updated ID

    if (discountRow && discountEl) {
        if (totalDiscount > 0) {
            discountRow.style.display = "flex";
            discountEl.innerText = formatPrice(totalDiscount);
        } else {
            discountRow.style.display = "none";
        }
    }

    // Update Extra Charges
    const extraChargesContainer = document.getElementById(
        "extra-charges-container"
    ); // Updated ID
    if (extraChargesContainer) extraChargesContainer.innerHTML = chargesHtml;

    // Update Final Total
    if (totalEl) totalEl.innerText = formatPrice(finalTotal);
}

function applyPromoCode() {
    const input = document.getElementById("promo-code-input");
    const message = document.getElementById("promo-message");
    const code = input.value.trim().toUpperCase();

    if (!code) {
        message.textContent = "Please enter a code";
        message.style.color = "red";
        return;
    }

    const settings = getGlobalSettings();
    const promo = (settings.promoCodes || []).find((p) => p.code === code);

    if (promo) {
        // Calculate promo discount
        const subtotal = cart.reduce((sum, item) => {
            const { price } = calculateItemPrice(item);
            return sum + price * item.quantity;
        }, 0);

        // Apply global offer first to get base for promo? Or base on subtotal?
        // Let's base on subtotal for simplicity unless specified otherwise.
        // Actually, usually promos apply after other discounts.
        let globalDiscount = 0;
        if (settings.globalOffer && settings.globalOffer.active) {
            if (settings.globalOffer.type === "percent") {
                globalDiscount = Math.round(
                    subtotal * (settings.globalOffer.value / 100)
                );
            } else {
                globalDiscount = settings.globalOffer.value;
            }
        }
        const baseAmount = Math.max(0, subtotal - globalDiscount);

        if (promo.type === "percent") {
            discount = Math.round(baseAmount * (promo.value / 100));
        } else {
            discount = promo.value;
        }

        message.textContent = `Promo Applied: ${code}`;
        message.style.color = "green";
        loadPaymentSummary();
    } else {
        discount = 0;
        message.textContent = "Invalid Promo Code";
        message.style.color = "red";
        loadPaymentSummary();
    }
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    document
        .querySelectorAll(".payment-option")
        .forEach((opt) => opt.classList.remove("selected"));
    document
        .querySelector(`input[value="${method}"]`)
        .closest(".payment-option")
        .classList.add("selected");
    document
        .querySelectorAll(".payment-details")
        .forEach((el) => el.classList.add("hidden"));
    document.getElementById(`${method}-details`).classList.remove("hidden");
}

function togglePaymentFields() {
    const method = document.querySelector(
        'input[name="payment"]:checked'
    ).value;
    document
        .querySelectorAll(".payment-details-fields")
        .forEach((el) => el.classList.add("hidden"));
    if (method === "upi")
        document.getElementById("upi-fields").classList.remove("hidden");
    else if (method === "card")
        document.getElementById("card-fields").classList.remove("hidden");
}

function applyPaymentPromo() {
    const input = document.getElementById("payment-promo-input");
    const code = input.value.trim().toUpperCase();
    if (!code) return showToast("Please enter a code");

    let currentTotalStr = document
        .getElementById("payment-total")
        .innerText.replace(/,/g, "");
    let currentTotal = parseInt(currentTotalStr);
    let discountAmount = 0;

    if (code === "TASTY10") {
        discountAmount = Math.floor(currentTotal * 0.1);
        showToast("Promo Applied: 10% Off!");
    } else if (code === "SAVE50") {
        discountAmount = 50;
        showToast("Promo Applied: ₹50 Off!");
    } else {
        return showToast("Invalid Promo Code");
    }

    const newTotal = currentTotal - discountAmount;
    document.getElementById("payment-total").innerText = formatPrice(
        newTotal < 0 ? 0 : newTotal
    );

    const discountRow = document.getElementById("payment-discount-row");
    const discountAmountEl = document.getElementById("payment-discount-amount");
    if (discountRow && discountAmountEl) {
        discountRow.style.display = "block";
        discountAmountEl.textContent = formatPrice(discountAmount);
    }
}

function processPayment() {
    if (!currentUser) {
        showToast("Please login to place an order");
        openLogin();
        return;
    }
    const cart = JSON.parse(localStorage.getItem("CART")) || [];
    if (cart.length === 0) return showToast("Your cart is empty");

    const addressInput = document.querySelector(
        'input[name="delivery-address"]:checked'
    );
    if (!addressInput) return showToast("Please select a delivery address");

    const methodInput = document.querySelector('input[name="payment"]:checked');
    if (!methodInput) return showToast("Please select a payment method");
    const method = methodInput.value;

    if (method === "upi") {
        const upiInput = document.querySelector("#upi-fields input");
        if (upiInput && !upiInput.value)
            return showToast("Please enter UPI ID");
    } else if (method === "card") {
        const cardInput = document.querySelector(
            '#card-fields input[placeholder="Card Number"]'
        );
        if (cardInput && !cardInput.value)
            return showToast("Please enter Card Number");
    }

    let lastOrderId = parseInt(localStorage.getItem("LAST_ORDER_ID")) || 1000;
    lastOrderId++;
    localStorage.setItem("LAST_ORDER_ID", lastOrderId);
    const orderId = lastOrderId;
    const total = document.getElementById("payment-total")
        ? document.getElementById("payment-total").innerText
        : "0";
    const addressId = parseInt(addressInput.value);
    const selectedAddress = currentUser.addresses.find(
        (a) => a.id === addressId
    );

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const settings = getGlobalSettings();

    // Recalculate discounts and charges for the order record
    let globalDiscount = 0;
    if (settings.globalOffer && settings.globalOffer.active) {
        if (settings.globalOffer.type === "percent") {
            globalDiscount = Math.round(
                subtotal * (settings.globalOffer.value / 100)
            );
        } else {
            globalDiscount = settings.globalOffer.value;
        }
    }

    // Promo discount is already applied to 'discount' global variable or we can recalculate if we stored the code
    // For now, let's use the 'discount' variable which holds the promo discount amount
    let promoDiscount = discount || 0;

    const totalDiscount = globalDiscount + promoDiscount;
    const taxableAmount = Math.max(0, subtotal - totalDiscount);

    let chargesTotal = 0;
    const orderCharges = (settings.extraCharges || []).map((charge) => {
        let amount = 0;
        if (charge.type === "percent") {
            amount = Math.round(taxableAmount * (charge.value / 100));
        } else {
            amount = charge.value;
        }
        chargesTotal += amount;
        return { ...charge, amount };
    });

    // Verify total matches
    // const calculatedTotal = taxableAmount + chargesTotal;

    const newOrder = {
        id: orderId,
        items: cart,
        subtotal: subtotal,
        discount: totalDiscount,
        charges: orderCharges,
        total: total, // Trusting the UI total for now, or we could use calculatedTotal
        date: new Date().toLocaleDateString(),
        status: "Preparing",
        timestamp: Date.now(),
        address: selectedAddress,
        paymentMethod: method,
        chat: [],
    };

    if (!currentUser.orders) currentUser.orders = [];
    currentUser.orders.unshift(newOrder);
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    localStorage.setItem("CART", "[]");

    showToast("Order Placed Successfully!");
    setTimeout(() => {
        window.location.href = "tracker.html";
    }, 2000);
}

// --- Address Management ---
function loadAddresses() {
    const list = document.getElementById("address-list");
    if (!list) return;
    if (!currentUser) {
        list.innerHTML = "<p>Please login to view addresses.</p>";
        return;
    }
    if (!currentUser.addresses) currentUser.addresses = [];
    if (currentUser.addresses.length === 0) {
        list.innerHTML = "<p>No saved addresses. Add one above!</p>";
        return;
    }

    list.innerHTML = currentUser.addresses
        .map(
            (addr) => `
        <div class="address-card ${
            selectedAddressId === addr.id ? "selected" : ""
        }" onclick="selectAddress(${addr.id})">
            <h4>${addr.label} ${
                addr.isDefault
                    ? '<span style="font-size:0.7rem; background:#28a745; color:white; padding:2px 6px; border-radius:4px; margin-left:5px;">Default</span>'
                    : ""
            }</h4>
            <p><strong>${addr.name}</strong> (${addr.phone})</p>
            <p>${addr.text}</p>
            <p>${addr.city}</p>
        </div>
    `
        )
        .join("");

    if (!selectedAddressId) {
        const defaultAddr = currentUser.addresses.find((a) => a.isDefault);
        if (defaultAddr) selectAddress(defaultAddr.id);
    }
}

function selectAddress(id) {
    selectedAddressId = id;
    loadAddresses();
}

function openAddressModal() {
    document.getElementById("address-modal").classList.add("active");
}
function closeAddressModal() {
    document.getElementById("address-modal").classList.remove("active");
}

function handleSaveAddress(e) {
    e.preventDefault();
    if (!currentUser) return showToast("Please login first");
    if (!currentUser.addresses) currentUser.addresses = [];
    const isFirst = currentUser.addresses.length === 0;

    const newAddr = {
        id: Date.now(),
        label: document.getElementById("addr-label").value,
        name: document.getElementById("addr-name").value,
        phone: document.getElementById("addr-phone").value,
        text: document.getElementById("addr-text").value,
        city: document.getElementById("addr-city").value,
        isDefault: isFirst,
    };

    currentUser.addresses.push(newAddr);
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Address Saved!");
    closeAddressModal();
    e.target.reset();

    if (window.location.href.includes("payment.html")) {
        loadPaymentAddresses();
        selectPaymentAddress(newAddr.id);
    } else {
        selectAddress(newAddr.id);
    }
}

function loadPaymentAddresses() {
    const container = document.getElementById("payment-address-list");
    if (!container) return;
    if (!currentUser) {
        container.innerHTML = `<p>Please login to view addresses.</p><button class="cta-button" onclick="openLogin()">Login</button>`;
        return;
    }
    if (!currentUser.addresses || currentUser.addresses.length === 0) {
        container.innerHTML = `<p>No saved addresses.</p><button class="cta-button" onclick="openAddressModal()">+ Add Address</button>`;
        return;
    }

    container.innerHTML = currentUser.addresses
        .map(
            (addr) => `
        <div class="payment-option address-option ${
            addr.isDefault ? "selected" : ""
        }" onclick="selectPaymentAddress(${addr.id})">
            <input type="radio" name="delivery-address" id="addr-${
                addr.id
            }" value="${addr.id}" ${addr.isDefault ? "checked" : ""}>
            <label for="addr-${addr.id}">
                <div class="method-details">
                    <span class="method-name">${addr.label}</span>
                    <span class="method-desc">${addr.text}, ${addr.city}</span>
                </div>
            </label>
        </div>
    `
        )
        .join("");
}

function selectPaymentAddress(id) {
    document
        .querySelectorAll(".address-card")
        .forEach((el) => el.classList.remove("selected"));
    const radio = document.getElementById(`addr-${id}`);
    if (radio) {
        radio.checked = true;
        radio.closest(".address-card").classList.add("selected");
    }
}

function renderProfileAddresses() {
    const list = document.getElementById("profile-address-list");
    if (!list) return;
    if (
        !currentUser ||
        !currentUser.addresses ||
        currentUser.addresses.length === 0
    ) {
        list.innerHTML = "<p>No saved addresses.</p>";
        return;
    }
    list.innerHTML = currentUser.addresses
        .map(
            (addr) => `
        <div class="address-card" style="position: relative;">
            <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                ${
                    !addr.isDefault
                        ? `<button class="cta-button" onclick="setDefaultAddress(${addr.id})" style="padding: 5px 10px; font-size: 0.7rem; background: #6c757d;">Set Default</button>`
                        : '<span style="font-size:0.8rem; background:#28a745; color:white; padding:5px 10px; border-radius:4px;">Default</span>'
                }
                <button class="btn-delete" onclick="deleteAddress(${
                    addr.id
                })" style="padding: 5px 10px; font-size: 0.7rem;">Delete</button>
            </div>
            <h4>${addr.label}</h4>
            <p><strong>${addr.name}</strong> (${addr.phone})</p>
            <p>${addr.text}</p>
            <p>${addr.city}</p>
        </div>
    `
        )
        .join("");
}

function setDefaultAddress(id) {
    if (!currentUser) return;
    currentUser.addresses.forEach((a) => {
        a.isDefault = a.id === id;
    });
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Default Address Updated");
    renderProfileAddresses();
}

function deleteAddress(id) {
    if (!confirm("Delete this address?")) return;
    currentUser.addresses = currentUser.addresses.filter((a) => a.id !== id);
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Address Deleted");
    renderProfileAddresses();
}

// ==========================================================================
// 9. CHAT SYSTEM (User-Centric)
// ==========================================================================

let currentChatUserEmail = null;

function openChat(userEmail = null) {
    if (!currentUser && !userEmail) {
        showToast("Please login to chat");
        openLogin();
        return;
    }

    const email = userEmail || currentUser.email;
    currentChatUserEmail = email;

    const chatTitle = document.getElementById("chat-order-id");
    if (chatTitle) {
        chatTitle.innerText = "TastyBites Messages";
        // Remove status badge if it exists
        const statusBadge = chatTitle.nextElementSibling;
        if (
            statusBadge &&
            statusBadge.classList.contains("order-status-badge")
        ) {
            statusBadge.remove();
        }
    }

    renderChatMessages();
    const modal = document.getElementById("chat-modal");
    if (modal) modal.classList.add("active");
}

function closeChat() {
    const modal = document.getElementById("chat-modal");
    if (modal) modal.classList.remove("active");
    currentChatUserEmail = null;
}

function renderChatMessages() {
    if (!currentChatUserEmail) return;

    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const user = allUsers.find((u) => u.email === currentChatUserEmail);

    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    if (!user || !user.chatMessages || user.chatMessages.length === 0) {
        chatBody.innerHTML =
            '<p style="text-align:center; color:#888; margin-top:20px;">No messages yet. Start chatting with us!</p>';
    } else {
        chatBody.innerHTML = user.chatMessages
            .map((msg) => {
                // Determine if the message is from "me" (the current viewer)
                // If viewer is admin, "me" is sender "admin".
                // If viewer is user, "me" is sender "user".
                const isAdminView =
                    window.location.href.includes("admin.html") ||
                    window.location.href.includes("customer_management.html");
                const isMe =
                    (isAdminView && msg.sender === "admin") ||
                    (!isAdminView && msg.sender === "user");

                return `
                <div class="chat-message ${isMe ? "me" : "other"}">
                    <div class="msg-bubble">${msg.text}</div>
                    <div class="msg-time">${new Date(
                        msg.timestamp
                    ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}</div>
                </div>
            `;
            })
            .join("");
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendChatMessage() {
    if (!currentChatUserEmail) return;
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    const isAdminView =
        window.location.href.includes("admin.html") ||
        window.location.href.includes("customer_management.html");
    const sender = isAdminView ? "admin" : "user";

    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const userIndex = allUsers.findIndex(
        (u) => u.email === currentChatUserEmail
    );

    if (userIndex === -1) return;

    if (!allUsers[userIndex].chatMessages) {
        allUsers[userIndex].chatMessages = [];
    }

    allUsers[userIndex].chatMessages.push({
        sender,
        text,
        timestamp: Date.now(),
    });

    localStorage.setItem("ALL_USERS", JSON.stringify(allUsers));

    // Sync with Current User if we are the user
    if (!isAdminView) {
        let currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
        if (currentUser && currentUser.email === currentChatUserEmail) {
            currentUser.chatMessages = allUsers[userIndex].chatMessages;
            localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
        }
    }

    input.value = "";
    renderChatMessages();
}

function pollChatMessages() {
    if (!currentUser) return;
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const user = allUsers.find((u) => u.email === currentUser.email);
    if (!user || !user.chatMessages) return;

    let hasNew = false;
    user.chatMessages.forEach((msg) => {
        if (msg.sender === "admin" && msg.timestamp > lastChatCheck)
            hasNew = true;
    });

    if (hasNew) {
        showToast("New message from TastyBites!");
        const badge = document.getElementById("chat-badge");
        if (badge) {
            badge.classList.remove("hidden");
            badge.innerText = "!";
        }
        lastChatCheck = Date.now();
    }
}

function startChatPolling() {
    setInterval(pollChatMessages, 5000);
}

function initContactPageChat() {
    // Just open the global chat for the current user
    if (!currentUser) {
        const chatBody = document.getElementById("chat-body");
        if (chatBody)
            chatBody.innerHTML =
                '<p class="chat-placeholder">Please <a href="#" onclick="openLogin()">login</a> to chat with us.</p>';
        return;
    }
    openChat(currentUser.email);
}

function openGlobalChat() {
    openChat(); // Opens for current user
}

function addGlobalChatButton() {
    if (
        document.getElementById("global-chat-btn") ||
        window.location.href.includes("admin") // Don't show on admin pages
    )
        return;
    const btn = document.createElement("button");
    btn.id = "global-chat-btn";
    btn.className = "global-chat-btn";
    btn.innerHTML = '<span class="material-icons">chat</span>';
    btn.onclick = () => openGlobalChat();
    document.body.appendChild(btn);
}
// ==========================================================================
// 10. ADMIN DASHBOARD
// ==========================================================================

function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("admin-email").value;
    const pass = document.getElementById("admin-pass").value;

    if (email === "admin@tastybites.com" && pass === "admin123") {
        localStorage.setItem("isAdmin", "true");
        // Redirect to new admin panel
        window.location.href = "admin_panel/admin_home.html";
        return;
    } else {
        showToast("Invalid Admin Credentials");
    }
}

function checkAdminLogin() {
    if (window.location.href.includes("admin.html")) {
        const isLoggedIn = localStorage.getItem("ADMIN_LOGGED_IN") === "true";
        const modal = document.getElementById("admin-login-modal");
        const dashboard = document.getElementById("admin-dashboard");

        if (isLoggedIn) {
            if (modal) modal.style.display = "none";
            if (dashboard) {
                dashboard.style.display = "flex";
                loadAdminDashboard();
            }
        } else {
            if (modal) modal.style.display = "flex";
            if (dashboard) dashboard.style.display = "none";
        }
    }
}

function logoutAdmin() {
    localStorage.removeItem("ADMIN_LOGGED_IN");
    window.location.reload();
}

function loadAdminDashboard() {
    const allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const tbody = document.getElementById("admin-orders-body");
    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;

    if (tbody) {
        tbody.innerHTML = "";
        allUsers.forEach((user) => {
            if (user.orders) {
                user.orders.forEach((order) => {
                    totalOrders++;
                    totalRevenue += parseInt(order.total.replace(/,/g, ""));
                    if (order.status !== "Delivered") pendingOrders++;

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td data-label="Order ID" style="font-weight:bold;">${
                            order.id
                        }</td>
                        <td data-label="Customer">${
                            user.name
                        }<br><span style="font-size:0.8rem; color:#888;">${
                        user.email
                    }</span></td>
                        <td data-label="Items">${order.items.length} Items</td>
                        <td data-label="Total">${order.total}</td>
                        <td data-label="Date">${order.date}</td>
                        <td data-label="Status">
                            <select class="status-select" id="status-${
                                order.id
                            }">
                                <option value="Processing" ${
                                    order.status === "Processing"
                                        ? "selected"
                                        : ""
                                }>Processing</option>
                                <option value="Preparing" ${
                                    order.status === "Preparing"
                                        ? "selected"
                                        : ""
                                }>Preparing</option>
                                <option value="Out for Delivery" ${
                                    order.status === "Out for Delivery"
                                        ? "selected"
                                        : ""
                                }>Out for Delivery</option>
                                <option value="Delivered" ${
                                    order.status === "Delivered"
                                        ? "selected"
                                        : ""
                                }>Delivered</option>
                                <option value="Cancelled by Restaurant" ${
                                    order.status === "Cancelled by Restaurant"
                                        ? "selected"
                                        : ""
                                }>Cancelled by Restaurant</option>
                            </select>
                        </td>
                        <td data-label="Actions">
                            <button class="btn-save" onclick="openChat('${
                                user.email
                            }')" style="background: #17a2b8; margin-bottom: 5px; border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Chat"><span class="material-icons">chat_bubble</span></button>
                            <button class="btn-save" onclick="updateOrderStatus('${
                                user.email
                            }', '${
                        order.id
                    }')" style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Update Status"><span class="material-icons">arrow_circle_up</span></button>
                            <button class="btn-delete" onclick="deleteOrder('${
                                user.email
                            }', '${
                        order.id
                    }')" style="margin-left:5px; border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Delete Order"><span class="material-icons">delete</span></button>
                        </td>
                    `;
                    tbody.prepend(tr);
                });
            }
        });
    }

    if (document.getElementById("total-orders"))
        document.getElementById("total-orders").innerText = totalOrders;
    if (document.getElementById("total-revenue"))
        document.getElementById("total-revenue").innerText =
            "₹" + formatPrice(totalRevenue);
    if (document.getElementById("pending-orders"))
        document.getElementById("pending-orders").innerText = pendingOrders;
}

function updateOrderStatus(userEmail, orderId) {
    const newStatus = document.getElementById(`status-${orderId}`).value;
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS"));
    const userIndex = allUsers.findIndex((u) => u.email === userEmail);
    if (userIndex !== -1) {
        const orderIndex = allUsers[userIndex].orders.findIndex(
            (o) => o.id === orderId
        );
        if (orderIndex !== -1) {
            allUsers[userIndex].orders[orderIndex].status = newStatus;
            localStorage.setItem("ALL_USERS", JSON.stringify(allUsers));

            const currentUser = JSON.parse(
                localStorage.getItem("CURRENT_USER")
            );
            if (currentUser && currentUser.email === userEmail) {
                currentUser.orders = allUsers[userIndex].orders;
                localStorage.setItem(
                    "CURRENT_USER",
                    JSON.stringify(currentUser)
                );

                const activeOrder = JSON.parse(
                    localStorage.getItem("ACTIVE_ORDER")
                );
                if (activeOrder && activeOrder.id === orderId) {
                    activeOrder.status = newStatus;
                    localStorage.setItem(
                        "ACTIVE_ORDER",
                        JSON.stringify(activeOrder)
                    );
                }
            }
            showToast(`Order ${orderId} updated to ${newStatus}`);
            loadAdminDashboard();
        }
    }
}

function deleteOrder(userEmail, orderId) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS"));
    const userIndex = allUsers.findIndex((u) => u.email === userEmail);
    if (userIndex !== -1) {
        allUsers[userIndex].orders = allUsers[userIndex].orders.filter(
            (o) => o.id !== orderId
        );
        localStorage.setItem("ALL_USERS", JSON.stringify(allUsers));

        const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
        if (currentUser && currentUser.email === userEmail) {
            currentUser.orders = allUsers[userIndex].orders;
            localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
        }
        showToast("Order Deleted Successfully");
        loadAdminDashboard();
    }
}

function switchAdminSection(section) {
    document.querySelectorAll(".admin-section-content").forEach((el) => {
        el.style.display = "none";
    });
    const target = document.getElementById(`section-${section}`);
    if (target) target.style.display = "block";

    document.querySelectorAll(".sidebar-menu li").forEach((li) => {
        li.classList.remove("active");
    });
    const activeLi = Array.from(
        document.querySelectorAll(".sidebar-menu li")
    ).find((li) => li.getAttribute("onclick").includes(`'${section}'`));
    if (activeLi) activeLi.classList.add("active");

    if (section === "orders") loadAdminDashboard();
    if (section === "customers") loadCustomersSection();
    if (section === "products") loadProductsSection();
    if (section === "settings") loadSettingsSection();
    if (section === "categories") loadCategoriesSection();
}

function loadCustomersSection() {
    const allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const tbody = document.getElementById("admin-customers-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    allUsers.forEach((user) => {
        if (user.email === "admin@tastybites.com") return;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Name">${user.name}</td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Phone">${user.phone || "N/A"}</td>
            <td data-label="Orders">${user.orders ? user.orders.length : 0}</td>
            <td data-label="Addresses">${
                user.addresses ? user.addresses.length : 0
            }</td>
            <td data-label="Action">
                <button class="cta-button" style="padding: 5px 10px; font-size: 0.8rem;" onclick="window.location.href='customer.html?email=${
                    user.email
                }'">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadProductsSection() {
    const items = getMenuItems();
    const tbody = document.getElementById("admin-products-body");
    populateCategoryDropdown(); // Ensure dropdown is populated
    if (!tbody) return;
    tbody.innerHTML = "";
    items.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Image"><img src="${item.image}" alt="${
            item.name
        }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td data-label="Name">${item.name}</td>
            <td data-label="Category">${item.category}</td>
            <td data-label="Price">₹${formatPrice(item.price)}</td>
            <td data-label="Actions">
                <button class="btn-save" onclick="editProduct(${
                    item.id
                })" style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Edit"><span class="material-icons">edit</span></button>
                <button class="btn-delete" onclick="deleteProduct(${
                    item.id
                })" style="margin-left:5px; border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Delete"><span class="material-icons">delete</span></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    let items = getMenuItems();
    items = items.filter((i) => i.id !== id);
    localStorage.setItem("MENU_ITEMS", JSON.stringify(items));
    showToast("Product Deleted");
    loadProductsSection();
}

// Settings Section Logic
function loadSettingsSection() {
    const settings = getGlobalSettings();

    // 1. Load Charges
    const chargesBody = document.getElementById("settings-charges-body");
    if (chargesBody) {
        chargesBody.innerHTML = "";
        (settings.extraCharges || []).forEach((charge, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${charge.name}</td>
                <td>${
                    charge.type === "percent" ? "Percent (%)" : "Flat (₹)"
                }</td>
                <td>${charge.value}</td>
                <td><button class="btn-delete" onclick="handleDeleteCharge(${index})" style="border-radius: 50%; width: 30px; height: 30px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><span class="material-icons" style="font-size: 16px;">delete</span></button></td>
            `;
            chargesBody.appendChild(tr);
        });
    }

    // 2. Load Global Offer
    const globalOffer = settings.globalOffer || {
        active: false,
        name: "",
        type: "percent",
        value: 0,
    };
    if (document.getElementById("global-offer-active"))
        document.getElementById("global-offer-active").checked =
            globalOffer.active;
    if (document.getElementById("global-offer-name"))
        document.getElementById("global-offer-name").value = globalOffer.name;
    if (document.getElementById("global-offer-type"))
        document.getElementById("global-offer-type").value = globalOffer.type;
    if (document.getElementById("global-offer-value"))
        document.getElementById("global-offer-value").value = globalOffer.value;

    // 3. Load Promo Codes
    const promosBody = document.getElementById("settings-promos-body");
    if (promosBody) {
        promosBody.innerHTML = "";
        (settings.promoCodes || []).forEach((promo, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${promo.code}</td>
                <td>${
                    promo.type === "percent" ? "Percent (%)" : "Flat (₹)"
                }</td>
                <td>${promo.value}</td>
                <td><button class="btn-delete" onclick="handleDeletePromo(${index})" style="border-radius: 50%; width: 30px; height: 30px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><span class="material-icons" style="font-size: 16px;">delete</span></button></td>
            `;
            promosBody.appendChild(tr);
        });
    }
}

function handleAddCharge(e) {
    e.preventDefault();
    const name = document.getElementById("new-charge-name").value;
    const type = document.getElementById("new-charge-type").value;
    const value = parseFloat(document.getElementById("new-charge-value").value);

    const settings = getGlobalSettings();
    if (!settings.extraCharges) settings.extraCharges = [];
    settings.extraCharges.push({ name, type, value });
    updateGlobalSettings(settings);

    document.getElementById("new-charge-name").value = "";
    document.getElementById("new-charge-value").value = "";
    showToast("Charge Added");
    loadSettingsSection();
}

function handleDeleteCharge(index) {
    if (!confirm("Delete this charge?")) return;
    const settings = getGlobalSettings();
    settings.extraCharges.splice(index, 1);
    updateGlobalSettings(settings);
    loadSettingsSection();
}

function handleGlobalOfferSave(e) {
    e.preventDefault();
    const active = document.getElementById("global-offer-active").checked;
    const name = document.getElementById("global-offer-name").value;
    const type = document.getElementById("global-offer-type").value;
    const value = parseFloat(
        document.getElementById("global-offer-value").value
    );

    const settings = getGlobalSettings();
    settings.globalOffer = { active, name, type, value };
    updateGlobalSettings(settings);
    showToast("Global Offer Saved");
}

function handleAddPromo(e) {
    e.preventDefault();
    const code = document.getElementById("new-promo-code").value.toUpperCase();
    const type = document.getElementById("new-promo-type").value;
    const value = parseFloat(document.getElementById("new-promo-value").value);

    const settings = getGlobalSettings();
    if (!settings.promoCodes) settings.promoCodes = [];
    if (settings.promoCodes.find((p) => p.code === code))
        return showToast("Code already exists");

    settings.promoCodes.push({ code, type, value });
    updateGlobalSettings(settings);

    document.getElementById("new-promo-code").value = "";
    document.getElementById("new-promo-value").value = "";
    showToast("Promo Code Added");
    loadSettingsSection();
}

function handleDeletePromo(index) {
    if (!confirm("Delete this promo code?")) return;
    const settings = getGlobalSettings();
    settings.promoCodes.splice(index, 1);
    updateGlobalSettings(settings);
    loadSettingsSection();
}

let editingProductId = null;

function handleProductSave(e) {
    e.preventDefault();
    const name = document.getElementById("prod-name").value;
    const category = document.getElementById("prod-category").value;
    const price = parseInt(document.getElementById("prod-price").value);
    const image = document.getElementById("prod-image").value;
    const offerType = document.getElementById("prod-offer-type").value;
    const offerValue =
        parseFloat(document.getElementById("prod-offer-value").value) || 0;

    let items = getMenuItems();

    if (editingProductId) {
        const index = items.findIndex((i) => i.id === editingProductId);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                name,
                category,
                price,
                image,
                offer: { type: offerType, value: offerValue },
            };
            showToast("Product Updated");
        }
    } else {
        const newId =
            items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
        items.push({
            id: newId,
            name,
            category,
            price,
            image,
            offer: { type: offerType, value: offerValue },
        });
        showToast("Product Added");
    }

    localStorage.setItem("MENU_ITEMS", JSON.stringify(items));
    resetProductForm();
    loadProductsSection();
}

function editProduct(id) {
    const items = getMenuItems();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    document.getElementById("prod-name").value = item.name;
    document.getElementById("prod-category").value = item.category;
    document.getElementById("prod-price").value = item.price;
    document.getElementById("prod-image").value = item.image;

    if (item.offer) {
        document.getElementById("prod-offer-type").value = item.offer.type;
        document.getElementById("prod-offer-value").value = item.offer.value;
    } else {
        document.getElementById("prod-offer-type").value = "none";
        document.getElementById("prod-offer-value").value = 0;
    }

    editingProductId = id;
    document.getElementById("product-form-title").innerText = "Edit Product";
    populateCategoryDropdown(item.category);
    window.scrollTo(0, 0);
}

function resetProductForm() {
    document.getElementById("prod-name").value = "";
    populateCategoryDropdown();
    document.getElementById("prod-price").value = "";
    document.getElementById("prod-image").value = "";
    document.getElementById("prod-offer-type").value = "none";
    document.getElementById("prod-offer-value").value = 0;
    editingProductId = null;
    document.getElementById("product-form-title").innerText = "Add New Product";
}

function populateCategoryDropdown(selected = null) {
    const select = document.getElementById("prod-category");
    if (!select) return;
    const categories = getCategories();
    select.innerHTML = categories
        .map(
            (c) =>
                `<option value="${c.id}" ${
                    selected === c.id ? "selected" : ""
                }>${c.name}</option>`
        )
        .join("");
}

// ==========================================================================
// 11. SETTINGS
// ==========================================================================

// ==========================================================================
// 12. CATEGORIES
// ==========================================================================

function loadCategoriesSection() {
    const categories = getCategories();
    const tbody = document.getElementById("admin-categories-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    categories.forEach((cat) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>
                <button class="btn-delete" onclick="deleteCategory('${cat.id}')" style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;"><span class="material-icons">delete</span></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function handleAddCategory(e) {
    e.preventDefault();
    const name = document.getElementById("new-cat-name").value;
    addCategory(name);
    document.getElementById("new-cat-name").value = "";
}
