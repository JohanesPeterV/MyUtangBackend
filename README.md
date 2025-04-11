# MyUtang Backend

A robust GraphQL API backend for managing personal debt tracking and user authentication, built with Node.js, Apollo Server, and Sequelize.

## 🚀 Features

- **GraphQL API**: Modern, type-safe API using Apollo Server with comprehensive debt management operations
- **Authentication**: JWT-based authentication with secure password hashing and role-based access control
- **Database**: PostgreSQL database with Sequelize ORM for reliable data persistence
- **Type Safety**: TypeScript support for better code quality and maintainability
- **Directives**: Custom GraphQL directives (@auth, @admin) for fine-grained access control
- **Real-time Data**: Efficient data fetching and updates with optimized queries
- **Debt Management**: Comprehensive features for tracking, updating, and settling debts
- **User Management**: Secure user registration, login, and profile management

## 🛠️ Tech Stack

- **Backend**: Node.js, Apollo Server
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcrypt
- **Language**: JavaScript/TypeScript
- **API**: GraphQL
- **Security**: Role-based access control, password hashing

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/myutangbackend.git
cd myutangbackend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=4000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

4. Start the development server:

```bash
npm start
```

## 🔧 Project Structure

```
myutangbackend/
├── server/              # GraphQL server implementation
│   ├── resolvers.js     # GraphQL resolvers with business logic
│   ├── typedef.js       # GraphQL type definitions and schema
│   ├── utils.js         # Utility functions and helpers
│   └── directives/      # Custom GraphQL directives for auth
├── database/            # Database configuration
│   ├── database.js      # Database connection setup
│   └── models.js        # Sequelize models and relationships
├── index.js             # Server entry point and configuration
└── package.json         # Project dependencies and scripts
```

## 🔐 Authentication & Authorization

The API implements a robust authentication system:

- JWT-based authentication for secure access
- Role-based access control with @auth and @admin directives
- Secure password hashing using bcrypt
- Token-based session management

To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📚 API Features

### User Management

- User registration and login
- Password change functionality
- Username updates
- Admin-level user management

### Debt Management

- Create and track debts
- Mark debts as paid
- View debt history
- Calculate total debts between users
- Update debt details
- Track both debts and lendings

## 🎮 API Documentation

The GraphQL playground is available at `http://localhost:4000` when the server is running. This provides an interactive environment to:

- Explore the API schema
- Test queries and mutations
- View documentation
- Debug API calls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Johanes Peter Vincentius**

---

A professional debt management solution
