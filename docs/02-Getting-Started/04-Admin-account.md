# Create an Admin account

---

Open the website with:

```
npm run dev
```

Go to the route `/account` and create a new account manually (name, email, password).

You'll recieve an email to verify the account.

After your account is created, open your terminal and run this:

```
npm run manage-users -- --toggle-admin <username>
```

Replace the `<username>` with your email's username

e.g: `myaccount123@gmail.com` the username is `myaccount123`

:::danger
Make sure to use a very strong password for the admin's account.
:::

---

_Last updated on July 2, 2025 by Ayman._
