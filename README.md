# Order Service

This service handles the management of orders, including CRUD operations and integration with the Product Service for stock updates.

## Getting Started

Follow these steps to set up and run the Product Service locally.

---

### Prerequisites

Ensure you have the following installed:
- **Node.js** 
- **npm** 
- **PostgreSQL** (Ensure the database server is running locally or accessible remotely)

---

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jenanzakarneh/order-service.git
   cd order-service
2. **Install Dependencies**:
   ```bash
   npm install


3.**Set Up the Environment**: Create a .env file with the following content:

DATABASE_URL=postgresql://postgres:QAZwsx123@localhost:5432/order_db

4. **Run Migrations**:
   
   ```bash
    npx prisma migrate dev

5. ***Running the Application***:
Start the Development Server:
  ```bash
  npm run start:dev

Open http://localhost:3000/api in your browser to view the API documentation.
