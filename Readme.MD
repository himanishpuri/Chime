# Chime

## Overview

This project is a real-time chat application built using Node.js, Express, and Socket.io. It allows users to join chat rooms and communicate with each other in real-time.

## Features

-  **User Authentication**: Secure login and registration system.
-  **Chat Rooms**: Users can create and join multiple chat rooms.
-  **Real-Time Messaging**: Instant messaging using Socket.io.
-  **User Presence**: Display online/offline status of users.
-  **Message History**: Store and retrieve chat history.

## Installation

### Prerequisites

-  Node.js
-  npm (Node Package Manager)

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/himanishpuri/chat-application.git
   ```
2. Navigate to the project directory:
   ```sh
   cd chat-application
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or log in with existing credentials.
3. Create or join a chat room.
4. Start chatting!

## Project Structure

-  `server.js`: Entry point of the application.
-  `routes/`: Contains route definitions.
-  `models/`: Contains database models.
-  `public/`: Contains static files (HTML, CSS, JS).
-  `views/`: Contains view templates.

## Technologies Used

-  **Node.js**: JavaScript runtime.
-  **Express**: Web framework for Node.js.
-  **Socket.io**: Real-time communication library.
-  **MongoDB**: NoSQL database.
-  **Mongoose**: MongoDB object modeling tool.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
