# The Admin Panel

The admin panel is a protected area of the website where staff members can manage the store's data, such as products, orders, and users. Access to the different sections within the panel is determined by the role assigned to your user account.

## Accessing the Admin Panel

To enter the admin panel, you must first have a staff role assigned to your account. The available staff roles are `PRODUCTS_MANAGER`, `ORDERS_MANAGER`, `CONTENT_MANAGER`, and `ADMIN`.

See the [User Management documentation](/docs/Setup-Store/User-Management) to learn how to assign roles.

Once your account has a staff role, click on your account in the header, and you will see the `Admin dashboard` button.

:::warning
Any account with access to the admin panel is a privileged account. Ensure it is secured with a very strong, unique password.
:::

## Admin Panel Roles & Access

What you can see and do in the admin panel depends entirely on your role. A user might have access to manage products but not see customer orders, or vice versa.

### Products Manager (`PRODUCTS_MANAGER`)

This role focuses on managing the store's catalog. They have access to:

- Products
- Categories
- Brands
- Sets
- Reviews
- Ads

### Orders Manager (`ORDERS_MANAGER`)

This role is responsible for processing and managing customer orders. They have access to:

- Orders
- Discount Codes
- Users (view only)

### Content Manager (`CONTENT_MANAGER`)

This role manages the website's visual and informational content. They have access to:

- Ads
- Gallery
- Partners
- Team
- Themes

### Administrator (`ADMIN`)

The administrator has unrestricted access and can see and manage all sections of the admin panel.

---

## Panel Sections by Role

Here is a quick-reference table showing which roles have access to each section of the admin panel.

| Admin Panel Section | Products Manager | Orders Manager | Content Manager | Admin |
| :------------------ | :--------------: | :------------: | :-------------: | :---: |
| **Core Panels**     |                  |                |                 |       |
| Dashboard           |                  |                |                 |  ✅   |
| Orders              |        ✅        |       ✅       |                 |  ✅   |
| Products            |        ✅        |                |                 |  ✅   |
| Categories          |        ✅        |                |                 |  ✅   |
| Brands              |        ✅        |                |                 |  ✅   |
| Sets                |        ✅        |                |                 |  ✅   |
| Users               |                  |       ✅       |                 |  ✅   |
| Discount Codes      |                  |       ✅       |                 |  ✅   |
| Reviews             |        ✅        |                |                 |  ✅   |
| **Content Panels**  |                  |                |                 |       |
| Ads                 |        ✅        |                |       ✅        |  ✅   |
| Gallery             |                  |                |       ✅        |  ✅   |
| Partners            |                  |                |       ✅        |  ✅   |
| Team                |                  |                |       ✅        |  ✅   |
| Themes              |                  |                |       ✅        |  ✅   |
| **System Panels**   |                  |                |                 |       |
| General (Settings)  |                  |                |                 |  ✅   |
| Backup              |                  |                |                 |  ✅   |
| Logs                |                  |                |                 |  ✅   |
| Feedback            |                  |                |                 |  ✅   |
| Help                |        ✅        |       ✅       |       ✅        |  ✅   |

---

_Last updated on November 7, 2025 by Ayman._
