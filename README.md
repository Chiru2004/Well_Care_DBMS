# Well Care - Hospital Management System

Well Care is a comprehensive hospital management system designed to streamline hospital operations with two primary modes: **Patient** and **Admin**. This project is built using **React**, **Node.js**, **Express.js**, and **MySQL**, offering features for appointment scheduling, medical history tracking, and doctor management.

## Features

### Patient Mode:
- **Book Appointments**: Patients can schedule appointments with available doctors.
- **Buy Medicines**: Purchase prescribed or over-the-counter medicines through the platform.
- **Medical History**: View and track past appointments and medical records.

### Admin Mode:
- **Doctor Management**: Admins can create, delete, and manage doctor profiles.
- **Manage Timings**: Set and update doctor availability for appointments.
- **Other Administrative Controls**: Manage hospital resources and streamline operations.

## Technologies Used
- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Installation and Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/well-care.git
    cd well-care
    ```

2. Install dependencies for both client and server:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. Configure environment variables:
   - Set up a `.env` file in the `server` directory with your MySQL database credentials:
     ```env
     DB_HOST=your-database-host
     DB_USER=your-database-username
     DB_PASSWORD=your-database-password
     DB_NAME=well_care_db
     ```

4. Run the application:

    - Start the backend server:
      ```bash
      cd server
      npm start
      ```

    - Start the React frontend:
      ```bash
      cd client
      npm start
      ```

5. Access the application at `http://localhost:3000`.

## Database Schema

The database schema is designed to support the following:
- **Patients**: Stores patient information and medical hisory.
- **Doctors**: Stores doctor profiles, specialties, and available appointment times.
- **Appointments**: Tracks appointment bookings and schedules.
- **Medicines**: Stores information about medicines available for purchase.

## Future Enhancements

- Add support for telemedicine consultations.
- Integration with payment gateways for easier medicine purchases and appointment bookings.
- Improved analytics for the admin panel to monitor hospital operations.


