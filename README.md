# LOAN API SERVICE

This project is a backend service for managing loan transactions. It is built using Node.js, Express, and Prisma ORM.

1.Clone the repository: https://github.com/Wuttiwat2001/LOAN-API-SERVICE

2.Install dependencies: npm install

3.Set up the environment variables: Create a .env file in the root directory and add the following variables:

DATABASE_URL="mysql://username:password@localhost:3306/loan_db"
JWT_SECRET="your_jwt_secret"
PORT=8080

4.Generate Prisma client

npx prisma generate

5.prisma migrate dev --name init

Usage

1.Start the development server : npm run dev

## API Endpoints

### Auth Endpoints
- `POST /auth/register` - Create a new user
- `POST /auth/login` - Login

### Request Endpoints
- `POST /requests/requestSender` - View loan requests that you have sent
- `POST /requests/requestReceiver` - View loan requests that others have sent to you
- `POST /requests/requestBorrow` - Create a new loan request
- `POST /approveOrRejectRequest` - Approve or reject a loan request

### User Endpoints
- `GET /users` - Find all users
- `GET /balance/:userId` - View the balance of a user

### Transaction Endpoints
- `POST /transactions` - View your transactions
- `POST /transactions/sender` - View transactions where you are the sender
- `POST /transactions/receiver` - View transactions where you are the receiver
- `POST /transactions/repay` - Repay a loan

### Environment Variables
DATABASE_URL - The URL of your database
JWT_SECRET - The secret key for JWT authentication
PORT - The port number on which the server will run (default is 8080)

Running with Docker Compose

1.Create a .env  file in the root directory and add the following variables:

DATABASE_URL="mysql://username:password@db3306/loan_db"
JWT_SECRET="your_jwt_secret"
PORT=8080

2.Create a Docker network

docker network create loan_network

3.Run the application using Docker Compose:

docker-compose up --build

4.if the tables are note created, change the DATABASE_URL in the .env file to use localhost and root:

DATABASE_URL="mysql://root:root@localhost:3306/loan_db"

5.Run the Prisma migration in the terminal (ensure Docker is still running):

npx prisma migrate dev

