# User Management

This guide explains how to use the command-line script (`manage-users`) to manage user accounts, including creating administrators, assigning roles, and generating test users.

## Available Commands

The base command is run from your terminal in the project's root directory:
`docker-compose exec app npm run manage-users -- <command> [arguments]`

| Command                             | Description                                                             |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `--list`                            | Lists all users with their email, role, and creation date.              |
| `--change-role <email> <role>`      | Changes the role of an existing user.                                   |
| `--create-fake-user <email> [role]` | Creates or updates a pre-verified user, perfect for testing.            |
| `--help`                            | Displays a help message with all available commands and usage examples. |

---

## How to Create an Admin Account

1.  **Create a standard account:**
    Go to the website's `/login` page and create a new account manually (name, email, password) or with a social login. If you sign up manually, you'll receive an email to verify your account.

2.  **Assign the Admin role:**
    After your account is created and verified, open your terminal and run the following command, replacing `<email>` with the email you just registered:

    ```bash
    docker-compose exec app npm run manage-users -- --change-role <email> ADMIN
    ```

3.  **Refresh and log in:**
    You're all set! Refresh the website, and your account will now have full administrator privileges.

:::danger
**Security First!**
Make sure the administrator account is secured with a very strong, unique password.
:::

---

## User Roles & Permissions

The system uses a role-based access control model. Here are the available roles and what they can do:

- **USER**
  - Can view products, create orders, and write reviews.
- **PRODUCTS_MANAGER**
  - Can manage Products, Categories, Brands, Sets, Gallery, and Reviews.
- **ORDERS_MANAGER**
  - Can manage Orders, Discount Codes, and Transactions.
- **CONTENT_MANAGER**
  - Can manage Ads, Gallery, Partners, Team, and Themes.
- **ADMIN**
  - Has full access to everything.

You can change any user's role using the `--change-role` command.

**Example:** To make `jane@example.com` a Products Manager:

```bash
docker-compose exec app npm run manage-users -- --change-role jane@example.com PRODUCTS_MANAGER
```

---

## Creating Test Users

For development and testing, you can instantly create pre-verified users with a default password.

To create a standard test user, run:

```bash
docker-compose exec app npm run manage-users -- --create-fake-user test@example.com
```

You can also assign a specific role upon creation:

```bash
docker-compose exec app npm run manage-users -- --create-fake-user manager@example.com PRODUCTS_MANAGER
```

The script will output the new user's information directly in the console.

:::tip
The default password for all fake users is `12345678`.
:::

_Last updated on November 7, 2025 by Ayman._
