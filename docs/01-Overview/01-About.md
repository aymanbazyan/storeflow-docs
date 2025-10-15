---
sidebar_position: 1
slug: /category/about-the-app
---

# About the App

---

Storeflow is a Next.js e-store that is easily editable and can be used for different types of stores. It has a beautiful and simple interface, a good search, filter, sort menu, and an easy admin panel for managing everything in the store, like products, categories, sales, promoted products and more.

I implemented a feature-rich admin panel where most things in the store are adjustable (e.g., categories, products, theme colors, etc.).

<!-- It uses PostgreSQL as the database, with secure authentication and administrative privileges. -->

---

![Performance test](../../static/img/performance-test.png)

Performance test results for the Homepage (by Google's Lighthouse)

---

## **Storeflow E-commerce Platform: Core Features**

Storeflow is a comprehensive e-commerce platform designed with a powerful admin dashboard for store management and a user-friendly storefront for an excellent customer experience.

---

### **1. Admin Dashboard (Store Management)**

Admins have full control over the store's products, sales, and appearance.

#### **Product & Inventory**

- **Product Management:** Easily create, edit, and delete products, categories, brands, and **product bundles (Sets)**.
- **Product Variants:** For minor differeces between the same products (e.g color, size, etc), you can add "variants" for any product.
- **Inventory Control:** Set stock levels, including "out-of-stock" and "unlimited" options. Stock is automatically updated when sets are sold, and write any private information for any product, such as its location in the store.
- **Rich Content:** Use a simple HTML editor (CKEditor5) for detailed descriptions and upload both images and videos for products.

#### **Sales & Orders**

- **Financial Dashboard:** Track sales, profits, and key financial metrics.
- **Order Management:** View, approve, or reject incoming orders. Admins can add a note explaining a rejection, and the Orders table is **live-updated** on the screen.
- **Manual Order Entry:** Log offline purchases, which automatically updates inventory and sales data, and you can search and pick the customer's email to connect the purchase with his account (if he has an account on the website), allowing him to review the products or see the purchase details from his account.
- **Custom Transactions:** Make manual adjustments to revenue, such as for special circumstances, like a price reduction or a tip.

#### **Marketing & Promotions**

- **Sales**: Set up discounts on products and sets, with a simple discount calculator.
- **Discount Codes:** Create and manage custom discount codes for customers.
- **Promotions:** Run sitewide sales, **Custom Advertisements**, feature promotional and new items on the storefront.

#### **Store Customization**

- **Homepage Content:** Control featured categories, the main banner, an interactive map on the website and a gallery for store photos.
- **Shipping Rules:** Set custom shipping fees based on customer regions.
- **Site Information:** Easily update general content like team members and partners.
- **Site theme:** The admin can set the primary, secondary and the header banner from the Themes panel.

#### **Security Management**

- **Export/Import database backup folder:** A function for backing up or restoring the entire site database.
- **Timeout Ips:** A dashboard to manage timed-out IP addresses to block spammers.
- **Users Management:** A dashboard to view/delete accounts created on the website, and the ability to delete old unverified accounts.
- **Feedback Management:** A central dashboard to view and manage all customer feedback submitted through the storefront.

---

### **2. Customer Storefront (Shopping Experience)**

A clean and intuitive interface for customers to browse and purchase.

#### **Browsing & Discovery**

- **Powerful Search:** A prominent search bar helps customers quickly find any product or set.
- **Advanced Filtering:** Sort and filter products by category, price, brand, discount, and other criteria.

#### **Shopping & Checkout**

- **Dynamic Shopping Cart:** A sidebar cart lets users easily view and manage their selected items.
- **Simple Checkout:** A streamlined, multi-step process for placing orders.
- **Payment Options:** Cash on Delivery is currently the only option.
- **Automated Email Notifications:** Customers automatically receive emails for important order updates (e.g., confirmation, rejection, admin's notes).
- **Reviews:** Customers will be able to leave reviews (Stars rate and a Comment) in products and sets that has been delivered, and other buyers can **Reply** to comments.
- **Feedback System:** A simple form allows customers to leave general feedback about their shopping experience, helping the store to improve.

---

### **3. User Accounts**

A dedicated area for registered customers to manage their activity.

- **Secure Authentication:** Standard email/password login, with a **Reset password** form, and support for **Google Oauth Login**.
- **Personal Dashboard:** A central "My Account" page to manage personal info, wishlists, and orders.
- **Order History & Control:** View all past orders and their current status (e.g., pending, approved). Customers can also cancel a recently placed order.
- **Wishlist:** Save favorite products for later purchase.
- **Email Confirmation:** Customer receive confirmation code on his email.

---

#### **And there's more!**

_Last updated on October 15, 2025 by Ayman._
