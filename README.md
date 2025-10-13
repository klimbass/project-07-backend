This is the backend of the AquaTrack app (https://github.com/laposhko/FullStackFusion)
("AquaTrack is an app for healthy tracking of the water drunk during the day or 
longer period.You can register a new account or sign in with your Google account, 
add water, see your progress, and statistics, and improve your drinking habit as a result.")

Backend API - Water Consumption Tracker

A robust Node.js backend service for tracking daily water consumption and user management.
🚀 Features Implemented
Core Functionality

    User Authentication & Authorization

        User registration and login

        JWT token-based authentication

        Token refresh mechanism

        Secure logout functionality

        Google OAuth integration

    Water Consumption Tracking

        Add, edit, and delete water intake records

        Daily and monthly water consumption statistics

        Personalized daily water intake goals

    User Profile Management

        Complete user profile management

        Avatar upload with Cloudinary integration

        Password reset via email

Technical Implementation

    RESTful API with proper HTTP status codes

    Comprehensive error handling with user-friendly messages

    CORS configuration for cross-origin requests

    Database integration with optimized structure

    API documentation using Swagger UI

📚 API Documentation
Authentication Endpoints (/users)

    POST /users/register - User registration (public)

    POST /users/login - User login (public)

    POST /users/logout - User logout (private)

    GET /users/current - Get current user info (private)

    PATCH /users/update - Update user profile (private)

    POST /users/refresh - Refresh access token (private)

    POST /users/forgot-password - Password reset via email (public)

    GET /users/auth/google - Google OAuth authentication (public)

Water Tracking Endpoints (/water)

    POST /water/add - Add water intake record (private)

    PATCH /water/:recordId - Edit water intake record (private)

    DELETE /water/:recordId - Delete water intake record (private)

    GET /water/daily/:date - Get daily water consumption (private)

    GET /water/monthly/:month - Get monthly water consumption (private)

Additional Features

    GET /users/stats - Get total registered users count (public)

    Cloudinary integration for image storage

    Google OAuth authentication

🛠 Technical Stack

    Runtime: Node.js

    Framework: Express.js

    Database: [Specify your DB - MongoDB/PostgreSQL/etc.]

    Authentication: JWT, Google OAuth

    File Storage: Cloudinary

    Documentation: Swagger UI Express

    Deployment: Render/Hosting platform

🔧 Development & Deployment

The project follows modern development practices:

    Structured project architecture

    Comprehensive error handling

    CORS configuration

    Environment-based configuration

    Production-ready deployment setup
