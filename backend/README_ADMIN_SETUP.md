# How to Create an Admin User

There are **three ways** to create an admin user in the system:

## Method 1: First User Becomes Admin (Automatic) ⭐ Recommended

The **first user** to sign up through the signup page will automatically be assigned the **admin** role. This is the easiest method:

1. Go to the signup page
2. Create the first account
3. That account will automatically be an admin
4. All subsequent signups will be regular users

## Method 2: Using the Create Admin Script

Use the provided script to create an admin user:

```bash
cd backend
npm run create-admin
```

This will create an admin with default credentials:
- Email: `admin@example.com`
- Password: `Admin1234`
- Full Name: `Admin User`

### Custom Admin Credentials

You can also specify custom credentials:

```bash
npm run create-admin <email> <password> <fullName>
```

Example:
```bash
npm run create-admin admin@myapp.com MySecurePass123 John Admin
```

**Note:** The script will:
- Check if an admin already exists (prevents creating multiple admins)
- Hash the password securely
- Create the admin user with active status

## Method 3: Manual Database Update

If you need to convert an existing user to admin, you can update the database directly:

### Using MongoDB Compass or MongoDB Shell:

1. Connect to your MongoDB database
2. Find the user collection
3. Update the user document:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Using MongoDB Atlas:

1. Go to your MongoDB Atlas cluster
2. Click "Browse Collections"
3. Find your database and `users` collection
4. Find the user document
5. Edit the `role` field from `"user"` to `"admin"`
6. Save the changes

## Verify Admin Access

After creating an admin user:

1. Logout if you're logged in
2. Login with the admin credentials
3. You should see the admin dashboard at `/admin`
4. The navbar should show your role as "Admin"

## Security Notes

- ⚠️ **Change the default password** after first login
- ⚠️ Admin users have full access to manage all users
- ⚠️ Only create admin users through trusted methods
- ⚠️ Keep admin credentials secure

## Troubleshooting

**Q: I created the first user but they're not admin?**
- Make sure you're the very first user (no other users exist in the database)
- Check the user's role in the database

**Q: The create-admin script says admin already exists?**
- An admin user already exists in the database
- You can either use that admin account or manually update a user in the database

**Q: How do I know if I'm an admin?**
- After login, check the navbar - it should show "Admin" badge
- Try accessing `/admin` - if you can see the admin dashboard, you're an admin
- Regular users will be redirected to `/profile`


