# Customer Login Integration Test

## Flow Testing: Admin Creates Customer → Customer Can Login

### Test Scenario:

1. **Admin login** → access dashboard
2. **Admin creates customer** → customer saved to localStorage
3. **Customer login** → customer can access account with created credentials

### Step-by-Step Test:

#### Phase 1: Admin Creates Customer

1. **Login as Admin:**

   ```
   Email: admin@freshko.com
   Password: admin123
   ```

2. **Navigate to Dashboard:**

   - Go to `/dashboard/customers`
   - Click "Add User" button

3. **Create New Customer:**

   ```
   First Name: John
   Last Name: Doe
   Email: john.doe@example.com
   Password: password123
   Phone: +1234567890
   Role: Customer (user)
   ```

4. **Verify Creation:**
   - Customer should appear in customers list
   - Customer data saved to localStorage 'freshko-users'

#### Phase 2: Customer Login Test

1. **Logout Admin:**

   - Click user menu → Logout

2. **Login as Created Customer:**

   ```
   Email: john.doe@example.com
   Password: password123
   ```

3. **Verify Customer Access:**
   - Login should succeed
   - User should see customer interface (not admin dashboard)
   - Can access cart, wishlist, profile
   - Should NOT see dashboard link in header

#### Phase 3: Role-Based Access

1. **Create Admin Customer:**
   - Admin creates customer with role "Administrator"
   - Test login with admin role customer
   - Verify admin access to dashboard

### Expected Results:

✅ **Customer Created by Admin** can login successfully
✅ **Role is preserved** (customer vs admin)
✅ **Dashboard access** based on role (admin role = dashboard access)
✅ **Cart/Wishlist** requires authentication
✅ **Data persistence** across browser refresh

### Technical Implementation:

- **Storage:** localStorage 'freshko-users' contains all customers
- **Authentication:** login() function checks both hardcoded admin + localStorage users
- **Role Management:** role field preserved from creation to login
- **Password:** stored as plaintext (demo only, would be hashed in production)

### Integration Points:

1. **Admin Dashboard** → `createUser()` function
2. **Customer Login** → `login()` function checks localStorage
3. **Authentication State** → Zustand store with persistence
4. **Role-Based UI** → Header shows different content for admin vs customer

This integration ensures a complete customer lifecycle from admin creation to customer login and usage.
