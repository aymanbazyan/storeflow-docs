# Create an Admin account

---

Open the website with:

```
npm run dev
```

Go to the route `/login` and create a new account manually (name, email, password).

You'll recieve an email to verify the account.

After your account is created, open your terminal and run this:

```
npm run manage-users -- --toggle-admin <email>
```

Replace the `<email>` with your account's email

e.g: `myaccount123@gmail.com`

Then refresh!

:::danger
Make sure to use a very strong password for the admin's account.
:::

:::tip
For testing purposes, you can create a fake user with any email using

```
npm run manage-users -- --make-fake-user <email>
```

You will then see the account's info in the console.

:::

---

_Last updated on September 15, 2025 by Ayman._
