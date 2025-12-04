# TastyBites - Food Delivery Website


TastyBites is a complete front-end implementation for a modern food delivery service. It features a rich user interface for customers to browse, order, and track their food, alongside a functional admin dashboard for order management. The entire application is built with vanilla HTML, CSS, and JavaScript, using `localStorage` to simulate a persistent backend for a seamless user experience.


## Test Here

This is a hosted web project on Github Pages does not require a Download or Clone setup.

1.  **Home Page:**
    ```bash
    https://omkar3600.github.io/TastyBites/menu.html
    ```

2.  **Admin Panel:**
    ```bash
    https://omkar3600.github.io/TastyBites/admin.html
    ```


## Key Features

### Customer Experience
*   **Interactive Menu:** Browse a dynamic menu with search and category filtering capabilities.
*   **Product Details:** View detailed information about each food item in a sleek modal view.
*   **Shopping Cart:** Add items to a cart, adjust quantities, and apply promo codes (`TASTY10`).
*   **User Authentication:** A simple login and sign-up system, including a "Demo User" option for quick access.
*   **User Profile:** A dedicated page for users to update personal information, view past order history, and manage their favorite food items.
*   **Checkout & Payment:** A secure checkout process with options for UPI and Cash on Delivery (COD).
*   **Real-time Order Tracking:** A visual stepper interface that updates the order status from "Processing" to "Delivered".
*   **Theme Toggle:** Switch between a light and dark mode for comfortable viewing.
*   **Responsive Design:** Fully responsive layout for a great experience on desktops, tablets, and mobile devices.

### Admin Dashboard
*   **Admin-Only Access:** A separate, secure login for administrators at `admin.html`.
*   **Live Statistics:** A dashboard displaying key metrics like total revenue, total orders, and pending orders.
*   **Order Management:** View all customer orders in a centralized table.
*   **Status Updates:** Change the status of any order (e.g., from "Preparing" to "Out for Delivery"). These changes are instantly reflected on the customer's order tracking page.

## Tech Stack
*   **HTML5**
*   **CSS3** (Flexbox, Grid, Custom Properties for theming)
*   **Vanilla JavaScript (ES6+)**
*   **localStorage API** (Used to simulate a database for users, carts, and orders)

## Pages
*   **`index.html`**: The landing page with a hero section, key features, and customer reviews.
*   **`menu.html`**: The main menu where users can browse, search, and filter food items.
*   **`contact.html`**: Displays contact information and includes a contact form.
*   **`profile.html`**: The user's personal dashboard to manage their account, view orders, and see favorites.
*   **`payment.html`**: The final step in the checkout process for selecting a payment method.
*   **`tracker.html`**: A page dedicated to visually tracking the live status of an active order.
*   **`admin.html`**: The administrative backend for managing all site orders and viewing statistics.

## How to Run Locally

This is a static web project and does not require a complex setup.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/omkar3600/tastybites.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd tastybites
    ```

3.  **Open `index.html` in your web browser.**
    *For the best experience, it is recommended to use a live server extension (like "Live Server" in VS Code) to serve the files, which prevents potential issues with browser security policies.*

## Usage Walkthrough

### Customer Flow
1.  Open `index.html` and click the **Login** button.
2.  For a quick tour, click the **Demo Login** button.
3.  Navigate to the **Menu** page, add a few items to your cart using the **Quick Add** button.
4.  Open the cart sidebar, apply the promo code **TASTY10** for a 10% discount, and click **Checkout**.
5.  On the **Payment** page, select a payment method (e.g., Cash on Delivery) and click **Pay Now**.
6.  You will be redirected to the **Order Tracker** page, which initially shows the status as "Preparing".

### Admin Flow
1.  In a separate browser tab, open the `admin.html` file.
2.  Log in using the following credentials:
    *   **Email:** `admin@tastybites.com`
    *   **Password:** `admin123`
3.  You will see the demo user's order in the "Recent Orders" table.
4.  Find the order and change its status from "Preparing" to "Out for Delivery" using the dropdown, then click **Update**.
5.  Switch back to the customer's **Order Tracker** tab. The tracker will automatically refresh to show the new status.
