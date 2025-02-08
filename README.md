# Bus Fare Payment and Ticketing System

## Project Overview

This project is a digital platform designed to streamline bus ticket booking, payment processing, and ticket verification using QR codes. The system allows passengers to easily search for routes, book tickets, securely process payments, and manage their bookings. Admins can manage routes, schedules, buses, users, and generate reports.

## Features

### Core Features

*   **User Registration and Login:** Secure user authentication for passengers and administrators.
*   **Route and Schedule Search:** Passengers can search for available bus routes based on origin, destination, and date.
*   **Ticket Booking:** Selection of bus route and schedule, seat selection (if implemented), and fare display.
*   **Payment Processing:** Integration with payment gateways (Mpesa) for secure online payments.
*   **QR Code Generation:** Generation of unique QR codes for each ticket upon successful payment.
*   **Ticket Verification (QR Code Scanning):** Mobile app for bus conductors to scan and verify ticket validity using QR codes.
*   **Admin Panel:** Comprehensive admin interface for managing:
    *   Bus routes, schedules, and fares
    *   Users and their accounts
    *   Reports on ticket sales, revenue, and bus occupancy
<!-- *   **Real-time Bus Tracking:** Display bus locations on a map in real-time using Google Maps API. -->
*   **Notifications:** Notifications for booking confirmation, reminders, and schedule changes.

### Additional Features (Depending on Implementation)

<!-- *   **Cancellation and Refund:** Option for passengers to cancel tickets within a specific timeframe and receive refunds. -->
*   **User Profile Management:** Management of booking history and payment methods.
*   **Role-Based Access Control (RBAC):** Different levels of access for administrators.
<!-- *   **Promotions:** Promotion codes to provide a discount amount and/or percentage. -->
*   **Soft Deletes:** Enables deletion of data without physical data loss.

## Technologies Used

*   **Backend:**
    *   **PHP:** Version 8.0+
    *   **Laravel Framework:** Version 10.0+
    *   **Database:** MySQL 
    *   **Payment Gateway:** Mpesa
    *   **QR Code Generation Library:** Simple-QRcode
    *   **Google Maps API**
*   **Frontend:**
    *   **JavaScript:** ES6+
    *   **React:** Version 18.0+
    *   **Inertia.js:** For seamless integration between Laravel backend and React frontend
    *   **CSS Framework:** Tailwind CSS
    *   **Icons:** Heroicons


## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/victorazangu/bus_fare_payment_and_ticketing_system.git
    cd bus_fare_payment_and_ticketing_system
    ```

2.  **Install Composer dependencies:**

    ```bash
    composer install
    ```

3.  **Copy the `.env.example` file to `.env` and configure your database:**

    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file with your database credentials:

    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    ```

4.  **Generate an application key:**

    ```bash
    php artisan key:generate
    ```

5.  **Run database migrations:**

    ```bash
    php artisan migrate
    ```

6.  **Install NPM dependencies:**

    ```bash
    npm install
    ```

7.  **Compile assets with Vite:**

    ```bash
    npm run dev
    ```

8.  **Seed the database (optional):**

    ```bash
    php artisan db:seed
    ```

9. **Start the development server:**

    ```bash
    php artisan serve
    ```

    In a separate terminal, run:

    ```bash
    npm run watch
    ```

## Configuration

### Environment Variables

*   **`APP_NAME`:** The name of your application.
*   **`APP_ENV`:** The environment your application is running in (e.g., `local`, `production`).
*   **`APP_DEBUG`:** Enable or disable debugging mode (`true` or `false`).
*   **`APP_URL`:** The URL of your application.
*   **`DB_CONNECTION`:** The database connection to use (e.g., `mysql`, `pgsql`).
*   **`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`:** Database connection details.
*   **`BROADCAST_DRIVER`, `CACHE_DRIVER`, `FILESYSTEM_DRIVER`, `QUEUE_CONNECTION`, `SESSION_DRIVER`:** Configuration for various Laravel services.



## Database Schema

The database schema includes the following tables:

*   `users`: Stores user information (passengers, administrators, drivers).
*   `buses`: Stores bus information (registration number, capacity, model, year, location).
*   `routes`: Stores route information (origin, destination, distance, estimated travel time).
*   `schedules`: Stores schedule information (bus ID, route ID, departure time, fare).
*   `bookings`: Stores booking information (user ID, schedule ID, seat numbers, QR code, payment status, total fare).
*   `payment_transactions`: Stores payment transaction details (booking ID, transaction ID, amount, payment method, status).
*   `seats`: Stores individual seat information (bus ID, seat number).
*   `schedule_seats`: Stores seats allocation for different schedules.
*   `bus_drivers`: Stores information about the bus and driver assignment.
*   `promotions`: Stores promotion codes and discounts, start date, end date, discount amount, discount percentage, code.
*   `cancellations`: Stores information about ticket cancellations and refunds.
*   `notifications`: Stores notifications sent to users.



