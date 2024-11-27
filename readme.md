# Project Readme

## Overview

The RBAC POC demonstrates the implementation of a Role-Based Access Control system to manage user permissions efficiently in a secure and scalable way. The project is designed to showcase the core concepts and practical use cases of RBAC, emphasizing the separation of roles, permissions, and resources. 

## Key Features

### Role Management
Define roles such as **Admin**, **User**, **Manager**, etc., with associated permissions.

### Permission Assignment
Grant or revoke access to specific resources or operations based on roles.

### User Association
Assign roles to users dynamically, ensuring flexibility and customization.

### Secure API Endpoints
Protect backend routes by enforcing role-based restrictions.


## Use Case Example

### Admin Role  
- Can manage roles and permissions for other users.

### Manager Role
- Extended permissions to access with specific resources.  
- Restricted from critical admin actions.

### User Role
- Limited access to view and interact with specific resources.


## Technologies Used

### Backend
- **Node.js**
- **Express.js**

### Frontend
- **React.js**
- **TailwindCSS**

### Authentication
- **JSON Web Tokens (JWT):** Secure user authentication and verification.

## Backend

The backend is built with Node.js and Express and is responsible for managing the application's core functionality like handling logic, API endpoints and data.

### Setup

1. Navigate to the `backend` directory:  
    ```bash
    cd backend
    ```

2. Install dependencies:  
    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory with the following content:  
    ```plaintext
    PORT=8080
    JWT_SECRET=your-secret-key
    ```

4. Start the server:  
    ```bash
    npm start
    ```

Ensure the backend server is running at [`http://localhost:8080`](http://localhost:8080).

## Frontend

The frontend is built using React and TailwindCSS, providing a modern and responsive user interface.

### Setup

1. Navigate to the `frontend` directory:  
    ```bash
    cd frontend
    ```

2. Install dependencies:  
    ```bash
    npm install
    ```

3. Start the development server:  
    ```bash
    npm start
    ```

Access the user interface at [`http://localhost:3000`](http://localhost:3000). 

## Purpose

This POC aims to illustrate the simplicity and effectiveness of Role-Based Access Control (RBAC) in modern applications, particularly for systems requiring strict access control mechanisms such as:

- **Enterprise software**
- **Multi-tenant platforms**
- **Content management systems (CMS)**
- **E-commerce platforms**
