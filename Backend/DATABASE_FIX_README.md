# Database Foreign Key Constraint Fix

## Problem
The application is failing to start due to foreign key constraint errors:
```
Cannot add or update a child row: a foreign key constraint fails 
(`flexispot`.`bookings`, CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` 
FOREIGN KEY (`user_id`) REFERENCES `users` (`id`))
```

## Root Cause
There are existing records in the `bookings` and `meeting_bookings` tables that reference user IDs that don't exist in the `users` table.

## Solutions

### Solution 1: Clean Database and Start Fresh (Recommended)

1. **Stop the application** if it's running

2. **Run the cleanup script** in MySQL:
   ```sql
   -- Connect to MySQL and run:
   USE flexispot;
   SET FOREIGN_KEY_CHECKS = 0;
   DROP TABLE IF EXISTS meeting_bookings;
   DROP TABLE IF EXISTS bookings;
   DROP TABLE IF EXISTS seats;
   DROP TABLE IF EXISTS meeting_rooms;
   DROP TABLE IF EXISTS users;
   SET FOREIGN_KEY_CHECKS = 1;
   ```

3. **Application is configured** to use `create-drop` mode, which will:
   - Drop all existing tables
   - Create new tables with proper foreign key constraints
   - Populate with sample data via `DataInitializer`

4. **Start the application** - it will automatically:
   - Create all tables with proper relationships
   - Initialize sample data (admin user, employee user, seats, meeting rooms)

### Solution 2: Manual Database Fix

If you want to preserve existing data:

1. **Backup existing data**:
   ```sql
   CREATE TABLE users_backup AS SELECT * FROM users;
   CREATE TABLE bookings_backup AS SELECT * FROM bookings;
   CREATE TABLE meeting_bookings_backup AS SELECT * FROM meeting_bookings;
   ```

2. **Fix orphaned records**:
   ```sql
   -- Delete bookings with non-existent user IDs
   DELETE FROM bookings WHERE user_id NOT IN (SELECT id FROM users);
   DELETE FROM meeting_bookings WHERE user_id NOT IN (SELECT id FROM users);
   ```

3. **Change application.properties** back to:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```

### Solution 3: Temporary Fix for Development

1. **Change application.properties** to:
   ```properties
   spring.jpa.hibernate.ddl-auto=create-drop
   ```

2. **Start the application** - it will recreate everything

3. **After first successful start**, change back to:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```

## Sample Data Created

The `DataInitializer` will create:

### Users
- **Admin User**: username: `admin`, password: `admin123`, role: `ADMIN`
- **Employee User**: username: `employee`, password: `employee123`, role: `EMPLOYEE`

### Seats
- A1-101 (Delhi, Building A, 1st Floor, Alpha)
- A1-102 (Delhi, Building A, 1st Floor, Alpha)
- B2-201 (Mumbai, Building B, 2nd Floor, Beta)

### Meeting Rooms
- MR001 (Delhi, Building A, 1st Floor)
- MR002 (Mumbai, Building B, 2nd Floor)

### Sample Bookings
- Employee has a seat booking for tomorrow
- Employee has a meeting room booking for day after tomorrow

## Login Credentials

After initialization, you can login with:

- **Admin**: username: `admin`, password: `admin123`
- **Employee**: username: `employee`, password: `employee123`

## Next Steps

1. **Run the cleanup script** or use the create-drop approach
2. **Start the application**
3. **Test the login** with the sample credentials
4. **Verify** that the frontend can connect to the backend

## Prevention

To prevent this issue in the future:
- Always ensure foreign key relationships are properly maintained
- Use database migrations for production environments
- Test data integrity regularly 