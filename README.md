# HitWicket Application ( Checkout game link in About section )

# Karuna Yadav (21BIT0243)

## Overview

This backend application has features for user authentication, room management, and real-time gameplay. The server is built using Node.js, Express, Sequelize, and WebSocket for handling real-time game updates. Backend is hosted at [https://hitwicket.azurewebsites.net/](https://hitwicket.azurewebsites.net/).

The Frontend Application is made using React.js and is available at [https://game-frontend-9t5.pages.dev/](https://game-frontend-9t5.pages.dev/).

## Backend Folder Structure

### `controllers` Folder:

1. **`authController.js`**:

   - Handles user registration and login functionalities using bcrypt for hashing passwords and JWT for authentication.

2. **`roomController.js`**:
   - Manages room creation, joining, retrieving room state, and making moves within a game.
   - Includes board state management and updates clients via WebSocket.

### `middleware` Folder:

1. **`authMiddleware.js`**:
   - Verifies JWT tokens for secured routes, attaches authenticated user to the request object.

### `models` Folder:

1. **`index.js`**:

   - Initializes Sequelize, connects to PostgreSQL, imports User, Room, and Log models, and syncs them with the database.

2. **`log.js`**:

   - Defines the Log model, tracking moves made by players within rooms.

3. **`room.js`**:

   - Defines the Room model, managing game rooms, players, board state, and status.

4. **`user.js`**:
   - Defines the User model, managing user data with UUIDs, usernames, and passwords.

### `routes` Folder:

1. **`authRoutes.js`**:

   - Handles registration and login routes for authentication.

2. **`gameRoutes.js`**:

   - Secured routes for making moves within a game.

3. **`roomRoutes.js`**:
   - Secured routes for room management (create, join, get state).

### `services` Folder:

1. **gameLogic.js**:

   - Implements the logic for making moves within a game, validating moves, and determining if a player has won.

2. **`roomService.js`**:
   - Generates unique room codes for game rooms.

### `ws` Folder:

1. **`websocket.js`**:
   - Handles WebSocket connections, allowing real-time updates to clients.

### `index.js` (Root Directory):

- Sets up the Express server, integrates routes, and manages WebSocket connections for real-time communication.

### `package.json`:

- Defines project dependencies and scripts for running the server, including bcryptjs, cors, dotenv, express, jsonwebtoken, pg, pg-hstore, sequelize, and ws.

# Frontend Folder Structure

## `src/`

- **`components/`**: Reusable UI components.
  - **`Auth/`**: Components related to authentication (e.g., login, registration).
    - `Login.js`
    - `Register.js`
  - **`Game/`**: Components for the game interface.
    - `Board.js`
    - `MoveHistory.js`
    - `PlayerStatus.js`
  - **`Room/`**: Components for managing game rooms.
    - `CreateRoom.js`
    - `JoinRoom.js`
    - `RoomList.js`
- **`context/`**: Contexts for managing global state.
  - `AuthContext.js`
  - `GameContext.js`
  - `RoomContext.js`
- **`hooks/`**: Custom React hooks.
  - `useAuth.js`
  - `useGame.js`
  - `useRoom.js`
- **`pages/`**: Page components representing different routes.
  - `HomePage.js`
  - `LoginPage.js`
  - `RegisterPage.js`
  - `GamePage.js`
  - `RoomPage.js`
- **`services/`**: API service files for making HTTP requests.
  - `authService.js`
  - `gameService.js`
  - `roomService.js`
- **`styles/`**: Global and component-specific styles.
  - `global.css`
  - `Auth.css`
  - `Game.css`
  - `Room.css`
- **`utils/`**: Utility functions and helpers.
  - `validation.js`
  - `constants.js`
- **`App.js`**: Root component that defines routes and renders the main layout.
- **`index.js`**: Entry point that renders the app and integrates global providers.

## `public/`

- **`index.html`**: Main HTML file.
- **`favicon.ico`**: Favicon for the application.

## `package.json`

- Defines project dependencies and scripts for running the frontend.

### Running the Server

To start the server, use the following command:

```bash
npm run start
```

The server will be running at `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST `/auth/register`**: Register a new user.
- **POST `/auth/login`**: Login with existing credentials.

### Room Management

- **POST `/rooms`**: Create a new room.
- **POST `/rooms/join`**: Join an existing room.
- **GET `/rooms/:roomId`**: Get the state of a specific room.

### Game Moves

- **POST `/rooms/:roomId/move`**: Make a move in the game.

## WebSocket

The server supports WebSocket connections for real-time updates. Clients can listen for updates on room states and game moves.

### Thank you for providing this opportunity!
