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

// --- 2. STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("CART")) || [];
let currentUser = JSON.parse(localStorage.getItem("CURRENT_USER")) || null;
let discount = 0;

// DOM Elements
const menuContainer = document.getElementById("menu-container");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");
const sidebar = document.getElementById("cart-sidebar");
const overlay = document.getElementById("overlay");
const authModal = document.getElementById("auth-modal");
const productModal = document.getElementById("product-modal");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

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
    const item = menuItems.find((p) => p.id === id);
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
    if (cartTotalElement)
        cartTotalElement.textContent = formatPrice(finalTotal);
    if (cartCountElement)
        cartCountElement.textContent = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
}

function checkout() {
    if (cart.length === 0) return showToast("Cart is empty!");
    if (!currentUser) {
        showToast("Please Login to Place Order");
        openLogin();
        return;
    }

    const orderId = "TB-" + Math.floor(Math.random() * 90000 + 10000);
    const total = document.getElementById("cart-total").textContent;

    const newOrder = {
        id: orderId,
        items: cart,
        total: total,
        date: new Date().toLocaleDateString(),
        status: "Processing",
        timestamp: new Date().getTime(),
    };

    currentUser.orders.push(newOrder);
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    localStorage.setItem("ACTIVE_ORDER", JSON.stringify(newOrder));

    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();

    // Redirect to payment page instead of tracker directly
    // Store the order temporarily if needed, or just pass the total via localStorage
    localStorage.setItem("cartTotal", total);
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

function renderMenu(items = menuItems) {
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
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
        const btnCat = btn.textContent.toLowerCase().replace(/\s/g, "");
        if (
            btnCat === category ||
            (category === "all" && btn.textContent === "All")
        )
            btn.classList.add("active");
    });

    const items =
        category === "all"
            ? menuItems
            : menuItems.filter((i) => i.category === category);
    renderMenu(items);
}

function searchMenu() {
    if (!menuContainer) return;
    const query = document.getElementById("search-input").value.toLowerCase();
    const items = menuItems.filter((i) => i.name.toLowerCase().includes(query));
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
    document.getElementById("edit-address").value = currentUser.address || "";

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
                    
                    <button class="cta-button" 
                        onclick="trackSpecificOrder('${order.id}')"
                        style="width: auto; padding: 8px 20px; font-size: 0.9rem;">
                        Track
                    </button>
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
    currentUser.address = document.getElementById("edit-address").value;
    localStorage.setItem("CURRENT_USER", JSON.stringify(currentUser));
    updateMasterUserList(currentUser);
    showToast("Profile Updated!");
    document.getElementById("profile-name").innerText = currentUser.name;
}

// --- 8. TRACKER LOGIC ---
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
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("admin-email").value;
    const pass = document.getElementById("admin-pass").value;

    if (email === "admin@tastybites.com" && pass === "admin123") {
        document.getElementById("admin-login-modal").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        loadAdminDashboard();
        showToast("Welcome, Admin!");
    } else {
        showToast("Invalid Admin Credentials");
    }
}

function logoutAdmin() {
    location.reload(); // Simple reload to reset state
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
                        </select>
                    </td>
                    <td>
                        <button class="btn-save" onclick="updateOrderStatus('${
                            user.email
                        }', '${order.id}')">Update</button>
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

function processPayment() {
    if (!selectedPaymentMethod) {
        showToast("Please select a payment method");
        return;
    }

    if (selectedPaymentMethod === "upi") {
        const upiId = document.getElementById("upi-id").value;
        // Basic validation
        if (!upiId && !document.querySelector(".qr-placeholder")) {
            // allow empty for demo if they "scanned"
        }
    }

    // Simulate Processing
    const btn = document.querySelector(".pay-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        // Update the active order status to "Paid" or just move to tracker
        let activeOrder = JSON.parse(localStorage.getItem("ACTIVE_ORDER"));
        if (activeOrder) {
            activeOrder.paymentMethod = selectedPaymentMethod;
            activeOrder.status = "Preparing"; // Move to next stage after payment
            localStorage.setItem("ACTIVE_ORDER", JSON.stringify(activeOrder));

            // Update in history as well
            let currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
            if (currentUser) {
                const orderIdx = currentUser.orders.findIndex(
                    (o) => o.id === activeOrder.id
                );
                if (orderIdx !== -1) {
                    currentUser.orders[orderIdx] = activeOrder;
                    localStorage.setItem(
                        "CURRENT_USER",
                        JSON.stringify(currentUser)
                    );
                    updateMasterUserList(currentUser);
                }
            }
        }

        showToast("Payment Successful!");
        setTimeout(() => {
            window.location.href = "tracker.html";
        }, 1000);
    }, 2000);
}
