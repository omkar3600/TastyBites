// Admin Panel Core Logic

// Utility: Format Price
function formatPrice(price) {
    return price.toLocaleString("en-IN");
}

// Utility: Show Toast
function showToast(message) {
    // Create toast element if not exists (or rely on main style if imported)
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

// Check Admin Login
function checkAdminLogin() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
        window.location.href = "../index.html";
    }
}

// Logout
function adminLogout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "../index.html";
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    document.querySelector(".admin-sidebar").classList.toggle("active");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    checkAdminLogin();

    // Highlight Active Menu
    const currentPage = window.location.pathname.split("/").pop();
    const menuLinks = document.querySelectorAll(".sidebar-menu a");
    menuLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});

// --- Data Loaders (Shared) ---

function getOrders() {
    const allUsers = JSON.parse(localStorage.getItem("ALL_USERS")) || [];
    let orders = [];
    allUsers.forEach((user) => {
        if (user.orders) {
            user.orders.forEach((order) => {
                orders.push({
                    ...order,
                    customerName: user.name,
                    customerEmail: user.email,
                });
            });
        }
    });
    return orders.sort((a, b) => b.timestamp - a.timestamp);
}

function getProducts() {
    return JSON.parse(localStorage.getItem("MENU_ITEMS")) || [];
}

const defaultCategories = [
    { id: "biryani", name: "Biryani" },
    { id: "chicken", name: "Chicken" },
    { id: "paneer", name: "Paneer" },
    { id: "vegetable", name: "Vegetable" },
    { id: "chinese", name: "Chinese" },
    { id: "southindian", name: "South Indian" },
    { id: "dessert", name: "Dessert" },
    { id: "breads", name: "Breads" },
    { id: "rice", name: "Rice" },
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
