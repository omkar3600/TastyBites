// --- 1. MOCK DATA (Menu Items) ---
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
let storedMenu = localStorage.getItem("MENU_ITEMS");
if (!storedMenu) {
    localStorage.setItem("MENU_ITEMS", JSON.stringify(menuItems));
}

function getMenuItems() {
    return JSON.parse(localStorage.getItem("MENU_ITEMS")) || menuItems;
}

// --- 2. STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("CART")) || [];
let currentUser = JSON.parse(localStorage.getItem("CURRENT_USER")) || null;
let discount = 0;

// DOM Elements (Initialized after components load)
let menuContainer,
    cartItemsContainer,
    cartTotalElement,
    cartCountElement,
    sidebar,
    overlay,
    authModal,
    productModal,
    loginForm,
    signupForm,
    tabLogin,
    tabSignup;

function initializeGlobalElements() {
    menuContainer = document.getElementById("menu-container");
    cartItemsContainer = document.getElementById("cart-items");
    cartTotalElement = document.getElementById("cart-total");
    cartCountElement = document.getElementById("cart-count");
    sidebar = document.getElementById("cart-sidebar");
    overlay = document.getElementById("overlay");
    authModal = document.getElementById("auth-modal");
    productModal = document.getElementById("product-modal");
    loginForm = document.getElementById("login-form");
    signupForm = document.getElementById("signup-form");
    tabLogin = document.getElementById("tab-login");
    tabSignup = document.getElementById("tab-signup");
}

// --- 3. CORE UTILITIES ---
function saveCart() {
    localStorage.setItem("CART", JSON.stringify(cart));
}
function formatPrice(amount) {
    return amount.toLocaleString("en-IN", { minimumFractionDigits: 0 });
}

function showToast(message) {
    const toastBox = document.getElementById("toast-box");
    if (!toastBox) return;
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `<i class="material-icons">check_circle</i> ${message}`;
    toastBox.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 4. AUTHENTICATION LOGIC ---

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
        name: name,
        email: email,
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

function loginAsDemo() {
    const demoUser = {
        name: "Demo User",
        email: "demo@tastybites.com",
        password: "demo",
        phone: "9876543210",
        address: "123 Tasty Street, Foodie City",
        orders: [],
        favorites: [1, 3, 5], // Pre-fill some favorites
    };

    // Ensure demo user is in the master list
    updateMasterUserList(demoUser);

    // Login
    currentUser = demoUser;
    localStorage.setItem("CURRENT_USER", JSON.stringify(demoUser));
    showToast("Logged in as Demo User");
    closeLogin();
    checkLoginState();
    if (window.location.href.includes("profile.html")) loadProfileData();
}

function checkLoginState() {
    const navAction = document.getElementById("user-action-area");
    if (!navAction) return;

    if (currentUser) {
        // CHANGED: Renders a User Badge Icon instead of Text Button
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

// --- 5. CART & CHECKOUT LOGIC ---

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

function updateCartUI() {
    if (cartItemsContainer) {
        if (cart.length === 0)
            cartItemsContainer.innerHTML =
                '<p class="empty-msg">Your cart is empty.</p>';
        else {
            cartItemsContainer.innerHTML = cart
                .map(
                    (item) => `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>₹${formatPrice(item.price)} x ${item.quantity}</p>
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
            `
                )
                .join("");
        }
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const finalTotal = subtotal - discount; // Simple discount logic for now

    // Update Discount UI
    const discountRow = document.getElementById("discount-row");
    const discountAmountEl = document.getElementById("discount-amount");
    if (discountRow && discountAmountEl) {
        if (discount > 0) {
            discountRow.style.display = "block";
            discountAmountEl.textContent = formatPrice(discount);
        } else {
            discountRow.style.display = "none";
        }
    }

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

    if (!code) {
        showToast("Please enter a code");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (code === "TASTY10") {
        discount = Math.floor(subtotal * 0.1);
        showToast("Promo Applied: 10% Off!");
    } else if (code === "SAVE50") {
        discount = 50;
        showToast("Promo Applied: ₹50 Off!");
    } else {
        discount = 0;
        showToast("Invalid Promo Code");
    }

    updateCartUI();
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

    // Redirect to payment page
    window.location.href = "payment.html";
}

// --- 6. MENU & FAVORITES LOGIC ---

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

    if (menuContainer) {
        // Find current filter state to refresh correctly
        const activeBtn = document.querySelector(".filter-btn.active");
        const category = activeBtn
            ? activeBtn.textContent.toLowerCase().replace(/\s/g, "")
            : "all";
        filterMenu(category);
    }
    if (window.location.href.includes("profile.html")) loadProfileData();
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
            <div onclick="openProductModal(${
                item.id
            })" style="cursor: pointer;">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="food-info">
                    <h3>${item.name}</h3>
                    <p class="price">₹${formatPrice(item.price)}</p>
                </div>
            </div>
            <div style="padding: 0 15px 15px;">
                <button class="add-btn" onclick="addToCart(${
                    item.id
                })">Quick Add</button>
            </div>
        </div>
        `;
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
    if (category === "all") {
        // items is already all items
    } else if (category === "favorites") {
        items = items.filter((i) => currentUser.favorites.includes(i.id));
    } else {
        items = items.filter((i) => i.category === category);
    }

    renderMenu(items);
}

function searchMenu() {
    if (!menuContainer) return;
    const query = document.getElementById("search-input").value.toLowerCase();
    const items = getMenuItems().filter((i) =>
        i.name.toLowerCase().includes(query)
    );
    renderMenu(items);
}

// --- 7. PROFILE PAGE LOGIC ---

function switchProfileTab(tabName) {
    document
        .querySelectorAll(".profile-tab")
        .forEach((t) => t.classList.remove("active"));
    document.getElementById(`tab-${tabName}`).classList.add("active");

    document
        .querySelectorAll(".profile-menu li")
        .forEach((l) => l.classList.remove("active"));
    // Simple logic to match menu items by index for demo
    if (tabName === "info")
        document
            .querySelectorAll(".profile-menu li")[0]
            .classList.add("active");
    if (tabName === "orders")
        document
            .querySelectorAll(".profile-menu li")[1]
            .classList.add("active");
    if (tabName === "favorites")
        document
            .querySelectorAll(".profile-menu li")[2]
            .classList.add("active");
    if (tabName === "addresses") {
        document
            .querySelectorAll(".profile-menu li")[3]
            .classList.add("active");
        renderProfileAddresses();
    }
}

function loadProfileData() {
    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    // Fill Personal Info
    document.getElementById("profile-name").innerText = currentUser.name;
    document.getElementById("profile-email").innerText = currentUser.email;
    document.getElementById("edit-name").value = currentUser.name;
    document.getElementById("edit-phone").value = currentUser.phone || "";
    document.getElementById("edit-email").value = currentUser.email;

    // Fill Orders (UPDATED WITH TRACK BUTTON)
    const ordersList = document.getElementById("orders-list");
    if (currentUser.orders.length === 0) {
        ordersList.innerHTML = "<p>No orders yet.</p>";
    } else {
        // We use .slice().reverse() to show newest orders first without mutating original array
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
                        <button class="cta-button" 
                            onclick="openChat('${order.id}', '${
                    currentUser.email
                }')"
                            style="width: auto; padding: 8px 20px; font-size: 0.9rem; background: #17a2b8;">
                            Chat
                        </button>
                        <button class="cta-button" 
                            onclick="trackSpecificOrder('${order.id}')"
                            style="width: auto; padding: 8px 20px; font-size: 0.9rem;">
                            Track
                        </button>
                        <button class="cta-button" 
                            onclick="deleteUserOrder('${order.id}')"
                            style="width: auto; padding: 8px 20px; font-size: 0.9rem; background: #ff4757;">
                            <i class="material-icons" style="font-size: 1.1rem;">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `
            )
            .join("");
    }

    // Fill Favorites
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
    currentUser.phone = document.getElementById("edit-phone").value;
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Profile Updated!");
    document.getElementById("profile-name").innerText = currentUser.name;
}

// --- 8. REAL-TIME TRACKER LOGIC ---

function initTracker() {
    // 1. Get the ID of the order we are tracking
    let activeOrderParams = JSON.parse(localStorage.getItem("ACTIVE_ORDER"));

    if (!activeOrderParams || !currentUser) {
        window.location.href = "menu.html";
        return;
    }

    // 2. FETCH LATEST DATA from User History (This is where Admin updates live)
    // We reload currentUser from localStorage to ensure we have the Admin's changes
    currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));

    // Find the specific order in the user's history to get the REAL status
    const realOrderData = currentUser.orders.find(
        (o) => o.id === activeOrderParams.id
    );

    if (!realOrderData) {
        console.error("Order not found in history");
        return;
    }

    // 3. Update UI Text
    document.getElementById(
        "order-id-display"
    ).innerText = `Order ID: #${realOrderData.id}`;
    document.getElementById(
        "order-status-text"
    ).innerText = `Current Status: ${realOrderData.status}`;
    document.getElementById(
        "tracker-total-price"
    ).innerText = `₹${realOrderData.total}`;

    // 4. Render Items
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

    // 5. Calculate Progress Step based on Status Text
    const statusMap = {
        Processing: 1,
        Preparing: 2,
        "Out for Delivery": 3,
        Delivered: 4,
    };

    const currentStep = statusMap[realOrderData.status] || 1;
    updateTrackerStepper(currentStep);

    // 6. ETA Logic
    const orderTime = realOrderData.timestamp;
    const arrivalTime = new Date(orderTime + 45 * 60000); // 45 mins after order
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

        // Reset classes
        el.classList.remove("current-item", "completed");

        // Apply logic
        if (i < currentStep) {
            el.classList.add("completed"); // Past steps are green/solid
        } else if (i === currentStep) {
            el.classList.add("current-item"); // Current step pulses
        }
        // Future steps remain gray (default CSS)
    }
}

function trackSpecificOrder(orderId) {
    if (!currentUser) return;

    // 1. Find the specific order in the user's history
    const order = currentUser.orders.find((o) => o.id === orderId);

    if (order) {
        // 2. Set this as the "Active Order" so tracker.html knows what to show
        localStorage.setItem("ACTIVE_ORDER", JSON.stringify(order));

        // 3. Go to the tracker page
        window.location.href = "tracker.html";
    }
}

// --- 9. UI TOGGLES ---
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

// --- 10. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        const icon = document.querySelector("#theme-toggle .material-icons");
        if (icon) icon.textContent = "light_mode";
    }
    checkLoginState();
    updateCartUI();
    if (menuContainer) renderMenu();
});

// ==========================================================================
// ADMIN DASHBOARD LOGIC
// ==========================================================================

// 1. Admin Login
// 1. Admin Login
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("admin-email").value;
    const pass = document.getElementById("admin-pass").value;

    if (email === "admin@tastybites.com" && pass === "admin123") {
        localStorage.setItem("ADMIN_LOGGED_IN", "true"); // Persist login
        document.getElementById("admin-login-modal").style.display = "none";
        const dashboard = document.getElementById("admin-dashboard");
        if (dashboard) {
            dashboard.style.display = "flex"; // Use flex for layout
            loadAdminDashboard();
        }
        showToast("Welcome, Admin!");
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

// 2. Load Dashboard Data
function loadAdminDashboard() {
    const allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const tbody = document.getElementById("admin-orders-body");

    // Stats Variables
    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;

    // Clear Table
    tbody.innerHTML = "";

    // 3. Aggregate Data (Loop through ALL users and ALL their orders)
    allUsers.forEach((user) => {
        if (user.orders) {
            user.orders.forEach((order) => {
                // Update Stats
                totalOrders++;
                totalRevenue += parseInt(order.total.replace(/,/g, "")); // Remove commas for math
                if (order.status !== "Delivered") pendingOrders++;

                // Render Row
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="font-weight:bold;">${order.id}</td>
                    <td>${
                        user.name
                    }<br><span style="font-size:0.8rem; color:#888;">${
                    user.email
                }</span></td>
                    <td>${order.items.length} Items</td>
                    <td>${order.total}</td>
                    <td>${order.date}</td>
                    <td>
                        <select class="status-select" id="status-${order.id}">
                            <option value="Processing" ${
                                order.status === "Processing" ? "selected" : ""
                            }>Processing</option>
                            <option value="Preparing" ${
                                order.status === "Preparing" ? "selected" : ""
                            }>Preparing</option>
                            <option value="Out for Delivery" ${
                                order.status === "Out for Delivery"
                                    ? "selected"
                                    : ""
                            }>Out for Delivery</option>
                            <option value="Delivered" ${
                                order.status === "Delivered" ? "selected" : ""
                            }>Delivered</option>
                            <option value="Cancelled by Restaurant" ${
                                order.status === "Cancelled by Restaurant"
                                    ? "selected"
                                    : ""
                            }>Cancelled by Restaurant</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn-save" onclick="openChat('${
                            order.id
                        }', '${
                    user.email
                }')" style="background: #17a2b8; margin-bottom: 5px; border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Chat">
                            <span class="material-icons">chat_bubble</span>
                        </button>
                        <button class="btn-save" onclick="updateOrderStatus('${
                            user.email
                        }', '${
                    order.id
                }')" style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Update Status">
                            <span class="material-icons">arrow_circle_up</span>
                        </button>
                        <button class="btn-delete" onclick="deleteOrder('${
                            user.email
                        }', '${
                    order.id
                }')" style="margin-left:5px; border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Delete Order">
                            <span class="material-icons">delete</span>
                        </button>
                    </td>
                `;
                tbody.prepend(tr); // Add newest to top
            });
        }
    });

    // Update Stats UI
    document.getElementById("total-orders").innerText = totalOrders;
    document.getElementById("total-revenue").innerText =
        "₹" + formatPrice(totalRevenue);
    document.getElementById("pending-orders").innerText = pendingOrders;
}

// 4. Update Status Logic
function updateOrderStatus(userEmail, orderId) {
    const newStatus = document.getElementById(`status-${orderId}`).value;
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS"));

    // Find User
    const userIndex = allUsers.findIndex((u) => u.email === userEmail);
    if (userIndex !== -1) {
        // Find Order
        const orderIndex = allUsers[userIndex].orders.findIndex(
            (o) => o.id === orderId
        );
        if (orderIndex !== -1) {
            // Update Status
            allUsers[userIndex].orders[orderIndex].status = newStatus;

            // Save to DB
            localStorage.setItem("ALL_USERS", JSON.stringify(allUsers));

            // Sync with CURRENT_USER if this is the logged-in user
            const currentUser = JSON.parse(
                localStorage.getItem("CURRENT_USER")
            );
            if (currentUser && currentUser.email === userEmail) {
                currentUser.orders = allUsers[userIndex].orders;
                localStorage.setItem(
                    "CURRENT_USER",
                    JSON.stringify(currentUser)
                );

                // Also update ACTIVE_ORDER if it matches, so Tracker updates instantly
                const activeOrder = JSON.parse(
                    localStorage.getItem("ACTIVE_ORDER")
                );
                if (activeOrder && activeOrder.id === orderId) {
                    activeOrder.status = newStatus; // You might need to add status logic to tracker to read this text
                    localStorage.setItem(
                        "ACTIVE_ORDER",
                        JSON.stringify(activeOrder)
                    );
                }
            }

            showToast(`Order ${orderId} updated to ${newStatus}`);
            loadAdminDashboard(); // Refresh UI
        }
    }
}

function deleteOrder(userEmail, orderId) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS"));
    const userIndex = allUsers.findIndex((u) => u.email === userEmail);

    if (userIndex !== -1) {
        // Filter out the order to delete it
        allUsers[userIndex].orders = allUsers[userIndex].orders.filter(
            (o) => o.id !== orderId
        );

        // Save to DB
        localStorage.setItem("ALL_USERS", JSON.stringify(allUsers));

        // Sync with CURRENT_USER if needed
        const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
        if (currentUser && currentUser.email === userEmail) {
            currentUser.orders = allUsers[userIndex].orders;
            localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
        }

        showToast("Order Deleted Successfully");
        loadAdminDashboard();
    }
}

// 5. Admin Navigation & Sections
function switchAdminSection(section) {
    // Hide all sections
    document.querySelectorAll(".admin-section-content").forEach((el) => {
        el.style.display = "none";
    });

    // Show selected section
    const target = document.getElementById(`section-${section}`);
    if (target) target.style.display = "block";

    // Update Sidebar Active State
    document.querySelectorAll(".sidebar-menu li").forEach((li) => {
        li.classList.remove("active");
    });
    // Find the li that calls this function with this section
    const activeLi = Array.from(
        document.querySelectorAll(".sidebar-menu li")
    ).find((li) => li.getAttribute("onclick").includes(`'${section}'`));
    if (activeLi) activeLi.classList.add("active");

    // Load Data
    if (section === "orders") loadAdminDashboard();
    if (section === "customers") loadCustomersSection();
    if (section === "products") loadProductsSection();
}

// 6. Customers Section
function loadCustomersSection() {
    const allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const tbody = document.getElementById("admin-customers-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    allUsers.forEach((user) => {
        // Skip admin user if stored in same list
        if (user.email === "admin@tastybites.com") return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || "N/A"}</td>
            <td>${user.orders ? user.orders.length : 0}</td>
            <td>${user.addresses ? user.addresses.length : 0}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 7. Products Section
function loadProductsSection() {
    const items = getMenuItems();
    const tbody = document.getElementById("admin-products-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    items.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${item.image}" alt="${
            item.name
        }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>₹${formatPrice(item.price)}</td>
            <td>
                <button class="btn-save" onclick="openProductModal(${
                    item.id
                })" style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${
                    item.id
                })" style="margin-left:5px; border-radius: 50%; width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 8. Product Management (CRUD)
function openProductModal(productId = null) {
    const modal = document.getElementById("product-modal-admin");
    if (!modal) return;

    const title = document.getElementById("product-modal-title");
    const form = document.getElementById("product-form");

    if (productId) {
        // Edit Mode
        const items = getMenuItems();
        const product = items.find((i) => i.id === productId);
        if (!product) return;

        title.innerText = "Edit Product";
        document.getElementById("prod-id").value = product.id;
        document.getElementById("prod-name").value = product.name;
        document.getElementById("prod-category").value = product.category;
        document.getElementById("prod-price").value = product.price;
        document.getElementById("prod-img-url").value = product.image;
    } else {
        // Add Mode
        title.innerText = "Add Product";
        form.reset();
        document.getElementById("prod-id").value = "";
    }

    modal.style.display = "block";
}

function closeProductModalAdmin() {
    const modal = document.getElementById("product-modal-admin");
    if (modal) modal.style.display = "none";
}

function handleProductSubmit(e) {
    e.preventDefault();

    const idStr = document.getElementById("prod-id").value;
    const name = document.getElementById("prod-name").value;
    const category = document.getElementById("prod-category").value;
    const price = parseInt(document.getElementById("prod-price").value);
    const imgUrl = document.getElementById("prod-img-url").value;
    const fileInput = document.getElementById("prod-img-file");

    let image = imgUrl;
    if (!image && fileInput.files.length > 0) {
        // Mock: Use a placeholder or object URL (temporary)
        image = "./assets/burger1.jpeg"; // Fallback/Mock
    }
    if (!image) image = "./assets/burger1.jpeg"; // Default

    let items = getMenuItems();

    if (idStr) {
        // Update
        const id = parseInt(idStr);
        const index = items.findIndex((i) => i.id === id);
        if (index !== -1) {
            items[index] = { id, name, category, price, image };
            showToast("Product Updated!");
        }
    } else {
        // Create
        const newId =
            items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
        items.push({ id: newId, name, category, price, image });
        showToast("Product Added!");
    }

    localStorage.setItem("MENU_ITEMS", JSON.stringify(items));
    closeProductModalAdmin();
    loadProductsSection();
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    let items = getMenuItems();
    items = items.filter((i) => i.id !== id);
    localStorage.setItem("MENU_ITEMS", JSON.stringify(items));

    showToast("Product Deleted");
    loadProductsSection();
}

// ==========================================================================
// PAYMENT PAGE LOGIC
// ==========================================================================

let selectedPaymentMethod = null;

function selectPayment(method) {
    selectedPaymentMethod = method;

    // UI Updates
    document
        .querySelectorAll(".payment-option")
        .forEach((opt) => opt.classList.remove("selected"));
    document
        .querySelector(`input[value="${method}"]`)
        .closest(".payment-option")
        .classList.add("selected");

    // Show/Hide Details
    document
        .querySelectorAll(".payment-details")
        .forEach((el) => el.classList.add("hidden"));
    document.getElementById(`${method}-details`).classList.remove("hidden");
}

// 5. Payment Page Promo Code
function applyPaymentPromo() {
    const input = document.getElementById("payment-promo-input");
    const code = input.value.trim().toUpperCase();

    if (!code) {
        showToast("Please enter a code");
        return;
    }

    // Get original total from localStorage (before discount)
    // We assume 'cartTotal' stored in checkout() is the subtotal if no discount was applied there,
    // OR it's the discounted total. To be safe for this feature, let's treat it as the amount to pay.
    // Ideally, we should store subtotal and discount separately.
    // For now, we will apply discount on the CURRENT displayed total.

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
        showToast("Invalid Promo Code");
        return;
    }

    // Update UI
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

    // Update ACTIVE_ORDER so the final paid amount is correct
    let activeOrder = JSON.parse(localStorage.getItem("ACTIVE_ORDER"));
    if (activeOrder) {
        activeOrder.total = formatPrice(newTotal < 0 ? 0 : newTotal);
        localStorage.setItem("ACTIVE_ORDER", JSON.stringify(activeOrder));
    }
}

// 6. Delete Order History Logic
function deleteUserOrder(orderId) {
    if (
        !confirm(
            "Are you sure you want to delete this order from your history?"
        )
    )
        return;

    if (!currentUser) return;

    // Remove from currentUser.orders
    currentUser.orders = currentUser.orders.filter((o) => o.id !== orderId);

    // Save to localStorage
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);

    showToast("Order removed from history");
    loadProfileData(); // Refresh list
}

// ==========================================================================
// ADDRESS MANAGEMENT LOGIC
// ==========================================================================

let selectedAddressId = null;

function loadAddresses() {
    const list = document.getElementById("address-list");
    if (!list) return;

    if (!currentUser) {
        list.innerHTML = "<p>Please login to view addresses.</p>";
        return;
    }

    // Ensure addresses array exists
    if (!currentUser.addresses) {
        currentUser.addresses = [];
        // Migrate legacy single address if exists
        if (currentUser.address) {
            currentUser.addresses.push({
                id: Date.now(),
                label: "Default",
                name: currentUser.name,
                phone: currentUser.phone || "",
                text: currentUser.address,
                city: "Unknown",
            });
            delete currentUser.address; // Cleanup legacy
            localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
            updateMasterUserList(currentUser);
        }
    }

    if (currentUser.addresses.length === 0) {
        list.innerHTML = "<p>No saved addresses. Add one above!</p>";
        return;
    }

    list.innerHTML = currentUser.addresses
        .map(
            (addr, idx) => `
        <div class="address-card ${
            selectedAddressId === addr.id ? "selected" : ""
        }" 
             onclick="selectAddress(${addr.id})">
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

    // Auto-select default if nothing selected
    if (!selectedAddressId) {
        const defaultAddr = currentUser.addresses.find((a) => a.isDefault);
        if (defaultAddr) selectAddress(defaultAddr.id);
    }
}

function selectAddress(id) {
    selectedAddressId = id;
    loadAddresses(); // Re-render to update selection UI
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

    // First address is default by default
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

    // Auto-select new address
    if (window.location.href.includes("payment.html")) {
        loadPaymentAddresses();
        selectPaymentAddress(newAddr.id);
    } else {
        selectAddress(newAddr.id);
    }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    // ... existing init ...
    if (document.getElementById("address-list")) {
        loadAddresses();
    }
    startChatPolling();
    addGlobalChatButton();
});

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
                        ? `<button class="cta-button" onclick="setDefaultAddress(${addr.id})" 
                           style="padding: 5px 10px; font-size: 0.7rem; background: #6c757d;">
                           Set Default
                           </button>`
                        : '<span style="font-size:0.8rem; background:#28a745; color:white; padding:5px 10px; border-radius:4px;">Default</span>'
                }
                <button class="btn-delete" onclick="deleteAddress(${addr.id})" 
                    style="padding: 5px 10px; font-size: 0.7rem;">
                    Delete
                </button>
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
// ORDER CHAT LOGIC
// ==========================================================================

let currentChatOrder = null;

function openChat(orderId, userEmail) {
    // 1. Find the order
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const user = allUsers.find((u) => u.email === userEmail);
    if (!user) return showToast("User not found");

    const order = user.orders.find((o) => o.id === orderId);
    if (!order) return showToast("Order not found");

    // 2. Set current chat context
    currentChatOrder = { orderId, userEmail };

    // 3. Update UI
    const chatOrderIdEl = document.getElementById("chat-order-id");
    if (chatOrderIdEl) {
        chatOrderIdEl.innerText = `Order #${orderId}`;

        // Handle Status Badge (Create or Update Sibling)
        let statusBadge = chatOrderIdEl.nextElementSibling;
        if (
            !statusBadge ||
            !statusBadge.classList.contains("order-status-badge")
        ) {
            statusBadge = document.createElement("div");
            statusBadge.className = "order-status-badge";
            chatOrderIdEl.parentNode.insertBefore(
                statusBadge,
                chatOrderIdEl.nextSibling
            );
        }
        statusBadge.innerText = order.status;
    }
    renderChatMessages();

    // 4. Open Modal ONLY if it exists (i.e., not on contact page)
    const modal = document.getElementById("chat-modal");
    if (modal) {
        modal.classList.add("active");
    }
}

function closeChat() {
    const modal = document.getElementById("chat-modal");
    if (modal) modal.classList.remove("active");
    currentChatOrder = null;
}

function renderChatMessages() {
    if (!currentChatOrder) return;

    // Fetch latest data
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const user = allUsers.find((u) => u.email === currentChatOrder.userEmail);
    const order = user.orders.find((o) => o.id === currentChatOrder.orderId);

    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    if (!order.chat || order.chat.length === 0) {
        chatBody.innerHTML =
            '<p style="text-align:center; color:#888; margin-top:20px;">No messages yet. Start chatting!</p>';
    } else {
        chatBody.innerHTML = order.chat
            .map((msg) => {
                const isMe =
                    (msg.sender === "admin" &&
                        window.location.href.includes("admin.html")) ||
                    (msg.sender === "user" &&
                        !window.location.href.includes("admin.html"));

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

    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendChatMessage() {
    if (!currentChatOrder) return;

    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    // Determine sender based on current page
    const sender = window.location.href.includes("admin.html")
        ? "admin"
        : "user";

    // Update Data
    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const userIndex = allUsers.findIndex(
        (u) => u.email === currentChatOrder.userEmail
    );
    if (userIndex === -1) return;

    const orderIndex = allUsers[userIndex].orders.findIndex(
        (o) => o.id === currentChatOrder.orderId
    );
    if (orderIndex === -1) return;

    if (!allUsers[userIndex].orders[orderIndex].chat) {
        allUsers[userIndex].orders[orderIndex].chat = [];
    }

    allUsers[userIndex].orders[orderIndex].chat.push({
        sender: sender,
        text: text,
        timestamp: Date.now(),
    });

    // Save
    localStorage.setItem("ALL_USERS", JSON.stringify(allUsers));

    // Sync Current User if it's the user chatting
    if (sender === "user") {
        let currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
        if (currentUser && currentUser.email === currentChatOrder.userEmail) {
            currentUser.orders = allUsers[userIndex].orders;
            localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
        }
    }

    input.value = "";
    renderChatMessages();
}

// Polling for Notifications
let lastChatCheck = Date.now();

function pollChatMessages() {
    if (!currentUser) return;

    let allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    const user = allUsers.find((u) => u.email === currentUser.email);
    if (!user || !user.orders) return;

    let hasNew = false;

    user.orders.forEach((order) => {
        if (order.chat) {
            order.chat.forEach((msg) => {
                if (msg.sender === "admin" && msg.timestamp > lastChatCheck) {
                    hasNew = true;
                }
            });
        }
    });

    if (hasNew) {
        showToast("New message from Admin!");
        const badge = document.getElementById("chat-badge");
        if (badge) {
            badge.classList.remove("hidden");
            badge.innerText = "!";
        }
        lastChatCheck = Date.now();
    }
}

function startChatPolling() {
    setInterval(pollChatMessages, 5000); // Check every 5 seconds
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes("contact.html")) {
        initContactPageChat();
    }
    if (window.location.href.includes("payment.html")) {
        loadPaymentSummary();
        loadPaymentAddresses();
    }
});

function initContactPageChat() {
    if (!currentUser) {
        const chatBody = document.getElementById("chat-body");
        if (chatBody)
            chatBody.innerHTML =
                '<p class="chat-placeholder">Please <a href="#" onclick="openLogin()">login</a> to chat about your orders.</p>';
        return;
    }

    if (!currentUser.orders || currentUser.orders.length === 0) {
        const chatBody = document.getElementById("chat-body");
        if (chatBody)
            chatBody.innerHTML =
                '<p class="chat-placeholder">You have no orders to chat about.</p>';
        return;
    }

    // Auto-open latest order
    const sortedOrders = currentUser.orders
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp);
    const latestOrder = sortedOrders[0];

    // Set current chat context without opening modal
    currentChatOrder = {
        orderId: latestOrder.id,
        userEmail: currentUser.email,
    };

    const chatOrderIdEl = document.getElementById("chat-order-id");
    if (chatOrderIdEl) {
        chatOrderIdEl.innerText = `Chat - Order #${latestOrder.id}`;

        // Handle Status Badge (Create or Update Sibling)
        let statusBadge = chatOrderIdEl.nextElementSibling;
        if (
            !statusBadge ||
            !statusBadge.classList.contains("order-status-badge")
        ) {
            statusBadge = document.createElement("div");
            statusBadge.className = "order-status-badge";
            chatOrderIdEl.parentNode.insertBefore(
                statusBadge,
                chatOrderIdEl.nextSibling
            );
        }
        statusBadge.innerText = latestOrder.status;
    }
    renderChatMessages();
}

// Payment Page Functions
function loadPaymentSummary() {
    const cart = JSON.parse(localStorage.getItem("CART")) || [];
    const container = document.getElementById("payment-items-list");
    const totalEl = document.getElementById("payment-total");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty</p>";
        if (totalEl) totalEl.innerText = "0";
        return;
    }

    container.innerHTML = cart
        .map(
            (item) => `
        <div class="payment-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `
        )
        .join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    if (totalEl) totalEl.innerText = total;
}

function loadPaymentAddresses() {
    const container = document.getElementById("payment-address-list");
    if (!container) return;

    if (!currentUser) {
        container.innerHTML = `
            <p>Please login to view addresses.</p>
            <button class="cta-button" onclick="openLogin()" style="margin-top:10px; font-size:0.9rem;">Login</button>
        `;
        return;
    }

    // Ensure addresses array exists (Migration Logic)
    if (!currentUser.addresses) {
        currentUser.addresses = [];
        // Migrate legacy single address if exists
        if (currentUser.address) {
            currentUser.addresses.push({
                id: Date.now(),
                label: "Default",
                name: currentUser.name,
                phone: currentUser.phone || "",
                text: currentUser.address,
                city: "Unknown",
            });
            delete currentUser.address; // Cleanup legacy
            localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
            updateMasterUserList(currentUser);
        }
    }

    if (currentUser.addresses.length === 0) {
        container.innerHTML = `
            <p>No saved addresses.</p>
            <button class="cta-button" onclick="openAddressModal()" style="margin-top:10px; font-size:0.9rem;">+ Add Address</button>
        `;
        return;
    }

    container.innerHTML =
        currentUser.addresses
            .map(
                (addr, index) => `
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
            .join("") +
        `
        <button class="cta-button" onclick="openAddressModal()" style="margin-top:10px; width:100%; background:#6c757d;">+ Add New Address</button>
    `;
}

function selectPaymentAddress(id) {
    document
        .querySelectorAll(".address-option")
        .forEach((el) => el.classList.remove("selected"));
    const radio = document.getElementById(`addr-${id}`);
    if (radio) {
        radio.checked = true;
        radio.closest(".address-option").classList.add("selected");
    }
}

function togglePaymentFields() {
    const method = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    document
        .querySelectorAll(".payment-details-fields")
        .forEach((el) => el.classList.add("hidden"));

    if (method === "upi") {
        const el = document.getElementById("upi-fields");
        if (el) el.classList.remove("hidden");
    } else if (method === "card") {
        const el = document.getElementById("card-fields");
        if (el) el.classList.remove("hidden");
    }
}

function processPayment() {
    if (!currentUser) {
        showToast("Please login to place an order");
        openLogin();
        return;
    }

    const cart = JSON.parse(localStorage.getItem("CART")) || [];
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }

    // Validate Address
    const addressInput = document.querySelector(
        'input[name="delivery-address"]:checked'
    );
    if (!addressInput) {
        showToast("Please select a delivery address");
        return;
    }

    const methodInput = document.querySelector('input[name="payment"]:checked');
    if (!methodInput) {
        showToast("Please select a payment method");
        return;
    }
    const method = methodInput.value;

    // Simple validation
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

    // Create Order
    const orderId = "TB-" + Math.floor(Math.random() * 90000 + 10000);
    const total = document.getElementById("payment-total")
        ? document.getElementById("payment-total").innerText
        : "0";

    // Get selected address details
    const addressId = parseInt(addressInput.value);
    const selectedAddress = currentUser.addresses.find(
        (a) => a.id === addressId
    );

    const newOrder = {
        id: orderId,
        items: cart,
        total: total,
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

    // Clear Cart
    localStorage.setItem("CART", "[]");

    showToast("Order Placed Successfully!");
    setTimeout(() => {
        window.location.href = "profile.html";
    }, 2000);
}

function addGlobalChatButton() {
    // Prevent adding if already exists or on admin page
    if (
        document.getElementById("global-chat-btn") ||
        window.location.href.includes("admin.html")
    )
        return;

    const btn = document.createElement("button");
    btn.id = "global-chat-btn";
    btn.className = "global-chat-btn";
    btn.innerHTML = '<span class="material-icons">chat</span>';
    btn.onclick = openGlobalChat;
    document.body.appendChild(btn);
}

function openGlobalChat() {
    if (!currentUser) {
        showToast("Please login to chat");
        openLogin();
        return;
    }

    if (!currentUser.orders || currentUser.orders.length === 0) {
        showToast("No orders to chat about");
        return;
    }

    // Open latest order chat
    const sortedOrders = currentUser.orders
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp);
    const latestOrder = sortedOrders[0];
    openChat(latestOrder.id, currentUser.email);
}

// Initialize
// --- 10. COMPONENT LOADER ---
async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            element.innerHTML = html;
        } else {
            console.error(`Failed to load ${filePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

async function loadAllComponents() {
    const components = [
        { id: "navbar-placeholder", path: "elements/navbar.html" },
        { id: "footer-placeholder", path: "elements/footer.html" },
        { id: "cart-sidebar-placeholder", path: "elements/cart-sidebar.html" },
        { id: "auth-modal-placeholder", path: "elements/auth-modal.html" },
        { id: "chat-modal-placeholder", path: "elements/chat-modal.html" },
        {
            id: "product-modal-placeholder",
            path: "elements/product-modal.html",
        },
    ];

    await Promise.all(components.map((c) => loadComponent(c.id, c.path)));
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load Components
    await loadAllComponents();

    // 2. Initialize Global Elements (now that HTML is injected)
    initializeGlobalElements();

    // 3. Load Menu
    renderMenu();

    // 4. Check User Login
    checkLoginState();

    // 5. Check Admin Login
    // checkAdminLogin(); // Note: checkAdminLogin was not defined in the viewed code, assuming it exists or was a placeholder.
    // If it doesn't exist, this might error. I'll comment it out if it wasn't there, but the view showed it.
    // Wait, I didn't see checkAdminLogin definition in the file view.
    // Let me check the file view again.
    // Ah, I viewed lines 1-800 and 1800-2026. It might be in the middle.
    // But it was called in the original code at line 2007. So it must exist.
    // I will keep it.
    if (typeof checkAdminLogin === "function") {
        checkAdminLogin();
    }

    // 6. Add Global Chat Button
    if (currentUser) {
        addGlobalChatButton();
        setInterval(pollChatMessages, 3000); // Poll every 3 seconds
    }

    // 7. Load Payment Summary if on payment page
    if (window.location.href.includes("payment.html")) {
        // These functions might rely on elements loaded dynamically?
        // Payment summary usually relies on 'payment-summary' div which is likely in payment.html main body.
        if (typeof loadPaymentSummary === "function") loadPaymentSummary();
        if (typeof loadPaymentAddresses === "function") loadPaymentAddresses();
    }

    // 8. Load Profile Data if on profile page
    if (window.location.href.includes("profile.html")) {
        loadProfileData();
    }
});
