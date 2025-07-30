-- Database Cleanup Script for FlexiSpot
-- Run this script in MySQL to clean up foreign key constraint issues

USE flexispot;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS meeting_bookings;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS meeting_rooms;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables in correct order (Hibernate will handle this automatically)
-- The application will recreate all tables with proper foreign key constraints

-- Optional: Create a backup of existing data before running this script
-- CREATE TABLE users_backup AS SELECT * FROM users;
-- CREATE TABLE bookings_backup AS SELECT * FROM bookings;
-- CREATE TABLE meeting_bookings_backup AS SELECT * FROM meeting_bookings; 