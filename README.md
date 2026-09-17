# Expense Tracker

🔗 **Live Demo:** https://expense-tracker-frontend-ai4y.onrender.com

A full-stack expense tracking application built with the MERN stack. Users can securely create an account, manage their income and expenses, and view their financial summaries.

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Recharts
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT + bcrypt

## Features

* User registration and login
* Create, view, edit, and delete transactions
* Track income and expenses
* Balance and category summaries
* User profile
* Submit feedback
* Responsive React interface

## Login System

Authentication uses **JWT-based authentication** with:

* Password hashing using **bcrypt**
* Short-lived **access tokens**
* **Refresh tokens** for obtaining new access tokens
* Protected backend routes using JWT middleware
* Authentication tokens stored on the client side

## Project Structure

```text
expense_tracker/
├── frontend/     # React frontend
├── Routes/       # Express API routes
├── Schema/       # MongoDB/Mongoose schemas
├── middlewares/  # Authentication middleware
├── config/       # Database configuration
└── app.js        # Express server
```