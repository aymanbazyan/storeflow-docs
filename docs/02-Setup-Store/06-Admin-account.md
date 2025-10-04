# Create an Admin account

---

Open the website:

Go to the route `/login` and create a new account manually (name, email, password) or with Google login.

You'll recieve an email to verify the account if you signed up manually.

After your account is created, open your terminal and run this:

```
docker-compose exec app npm run manage-users -- --toggle-admin <email>
```

Replace the `<email>` with your account's email

Then refresh!

:::danger
Make sure to use a very strong password for the admin's account.
:::

:::tip
For testing purposes, you can create a fake user with any email using

```
docker-compose exec app npm run manage-users -- --make-fake-user <email>
```

You will then see the account's info in the console.

:::

---

_Last updated on October 4, 2025 by Ayman._
