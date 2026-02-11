# User Management

This guide explains how to manage user accounts, including creating the first administrator and assigning roles.

## How to Create the First Admin Account

To ensure the system is secure, the very first administrator account must be assigned by the owner through the command-line interface.

1.  **Create a standard account:**
    Go to the website's `/login` page and sign up with your name, email, and a strong password. You will receive an email to verify your account.

2.  **Assign the Admin role via terminal:**
    After your account is created and verified, open your terminal in the project's root directory and run the following command, replacing `<email>` with the email you just registered:

    ```bash
    docker-compose exec app bun run manage-users -- --change-role <email> ADMIN
    ```

3.  **Log in and manage users from the Admin Panel:**
    Log in and refresh the website. Your account now has full administrator privileges. From this point on, you can manage all other user roles directly from the **Admin Panel -> Users** page (Card Table).

:::danger
**Security First!**
The initial administrator account should be protected with a very strong, unique password.
:::

---

## User Roles & Permissions

The system uses a role-based access control model. An administrator can assign roles to any user through the **Admin Panel**.

Here are the available roles and their permissions:

- **USER**
  - Can view products, create orders, and write reviews.
- **PRODUCTS_MANAGER**
  - Can manage Products, Categories, Brands, Sets, Gallery, and Reviews.
- **ORDERS_MANAGER**
  - Can manage Orders, Discount Codes, Feedbacks, Reviews and Transactions.
- **CONTENT_MANAGER**
  - Can manage Ads, Gallery, Partners, Team, and Themes.
- **ADMIN**
  - Has full access to the entire system, including user management.

---

## Managing Users with the Command-Line (Advanced)

While all user management can be handled from the Admin Panel, the command-line script (`manage-users`) is available for initial setup and for developers during testing.

### Available Commands

The base command is run from your terminal in the project's root directory:
`docker-compose exec app bun run manage-users -- <command> [arguments]`

| Command                             | Description                                                             |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `--list`                            | Lists all users with their email, role, and creation date.              |
| `--change-role <email> <role>`      | Changes the role of an existing user. (Mainly for initial admin setup). |
| `--create-fake-user <email> [role]` | Creates or updates a pre-verified user, perfect for testing.            |
| `--help`                            | Displays a help message with all available commands.                    |

### Creating Test Users

For development, you can instantly create pre-verified users with a default password.

To create a standard test user, run:

```bash
docker-compose exec app bun run manage-users -- --create-fake-user test@example.com
```

You can also assign a specific role upon creation:

```bash
docker-compose exec app bun run manage-users -- --create-fake-user manager@example.com PRODUCTS_MANAGER
```

:::tip
The default password for all fake users is `12345678`.
:::

_Last updated on November 13, 2025, by Ayman._
