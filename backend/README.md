# Backend Authentication App

This project is a backend authentication application designed to handle separate registration and login processes for clients and admins. It utilizes Express.js and MongoDB for managing user data securely.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend-auth-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables (see below).

## Usage

To start the server, run:
```
npm start
```
The server will run on `http://localhost:5000` by default.

## API Endpoints

### Admin Endpoints

- **POST** `/api/admin/register` - Register a new admin
- **POST** `/api/admin/login` - Login an existing admin

### Client Endpoints

- **POST** `/api/client/register` - Register a new client
- **POST** `/api/client/login` - Login an existing client

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

## License

This project is licensed under the MIT License.