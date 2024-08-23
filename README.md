# Role-Based Access Control System with Real-Time Notifications

## Overview

This project implements a Role-Based Access Control (RBAC) system with real-time notifications using Node.js, Express, MongoDB, and WebSocket (Socket.io). It provides RESTful APIs for user authentication, role-based access control, CRUD operations for posts and comments, and real-time notifications when posts are commented on.

## Setup

### Prerequisites

- Node.js (v14.x or later)
- MongoDB

## PostMan API Collection
- `https://www.postman.com/testing-apis-3767/workspace/backend-apis-testing`

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add your environment variables:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/rbac
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. **Run the Server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

### Running Tests

1. **Install Testing Dependencies**

   ```bash
   npm install --save-dev mocha chai chai-http
   ```

2. **Run Tests**

   ```bash
   npm test
   ```

## API Endpoints

### Authentication

- **Register a new user**

  - **Endpoint:** `POST /api/auth/register`
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string",
      "role": "Admin|Moderator|User"
    }
    ```
  - **Response:**
    - Status: 201 Created
    - Body: `"User registered successfully"`

- **Login**

  - **Endpoint:** `POST /api/auth/login`
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response:**
    - Status: 200 OK
    - Body:
      ```json
      {
        "accessToken": "string",
        "refreshToken": "string"
      }
      ```

- **Refresh Access Token**

  - **Endpoint:** `POST /api/auth/token`
  - **Headers:**
    - `Cookie: refreshToken=your_refresh_token`
  - **Response:**
    - Status: 200 OK
    - Body:
      ```json
      {
        "accessToken": "string"
      }
      ```

### Role-Based Access Control (RBAC)

- **Access Protected Routes**

  Admins, Moderators, and Users have different access rights to the following routes based on their roles.

### Post CRUD Operations

- **Create a Post**

  - **Endpoint:** `POST /api/posts`
  - **Headers:**
    - `Authorization: Bearer your_access_token`
  - **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string"
    }
    ```
  - **Response:**
    - Status: 201 Created
    - Body: Post details

- **Read All Posts**

  - **Endpoint:** `GET /api/posts`
  - **Response:**
    - Status: 200 OK
    - Body: List of posts

- **Read a Single Post**

  - **Endpoint:** `GET /api/posts/:id`
  - **Response:**
    - Status: 200 OK
    - Body: Post details

- **Update a Post**

  - **Endpoint:** `PUT /api/posts/:id`
  - **Headers:**
    - `Authorization: Bearer your_access_token`
  - **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string"
    }
    ```
  - **Response:**
    - Status: 200 OK
    - Body: Updated post details

- **Delete a Post**

  - **Endpoint:** `DELETE /api/posts/:id`
  - **Headers:**
    - `Authorization: Bearer your_access_token`
  - **Response:**
    - Status: 200 OK
    - Body: `"Post deleted successfully"`

### Comment CRUD Operations

- **Create a Comment**

  - **Endpoint:** `POST /api/comments`
  - **Headers:**
    - `Authorization: Bearer your_access_token`
  - **Request Body:**
    ```json
    {
      "postId": "string",
      "content": "string"
    }
    ```
  - **Response:**
    - Status: 201 Created
    - Body: Comment details

- **Read a Single Comment**

  - **Endpoint:** `GET /api/comments/:id`
  - **Response:**
    - Status: 200 OK
    - Body: Comment details

- **Update a Comment**

  - **Endpoint:** `PUT /api/comments/:id`
  - **Headers:**
    - `Authorization: Bearer your_access_token`
  - **Request Body:**
    ```json
    {
      "content": "string"
    }
    ```
  - **Response:**
    - Status: 200 OK
    - Body: Updated comment details

- **Delete a Comment**

  - **Endpoint:** `DELETE /api/comments/:id`
  - **Headers:**
    - `Authorization: Bearer your_access_token`
  - **Response:**
    - Status: 200 OK
    - Body: `"Comment deleted successfully"`

### Real-Time Notifications

When a user comments on a post, the post's author will receive a real-time notification through WebSocket.

- **WebSocket Events:**
  - `connect`: Logs connection status.
  - `join`: Join a WebSocket room based on user ID.
  - `disconnect`: Logs disconnection status.