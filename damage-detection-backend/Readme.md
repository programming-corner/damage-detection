# 🔧 Damage Detection Backend

Node.js/Express API server for the damage detection system.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📋 Planned Features

- **Authentication API**: JWT-based user authentication
- **Reports API**: CRUD operations for incident reports
- **File Upload**: Image storage and processing
- **User Management**: User profiles and permissions
- **Analytics**: Reporting and dashboard data
- **Real-time Updates**: WebSocket support

## 🏗️ Architecture (Planned)

```
├── src/
│   ├── controllers/          # Route handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Helper functions
│   └── app.js               # Express app setup
├── tests/                   # Unit and integration tests
├── docs/                    # API documentation
├── package.json
└── README.md
```

## 🔗 API Endpoints (Planned)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### File Upload
- `POST /api/upload/image` - Upload incident images

## 🗄️ Database Schema (Planned)

### Users Table
- `id` - Primary key
- `email` - User email
- `name` - User full name
- `role` - User role (admin, manager, staff)
- `created_at` - Account creation date

### Reports Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Report title
- `description` - Detailed description
- `category` - Incident category
- `severity` - Severity level
- `status` - Report status
- `images` - Array of image URLs
- `location` - Incident location
- `created_at` - Report creation date

## 🔧 Development

This backend will be built using:
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - Database ORM
- **JWT** - Authentication
- **Multer** - File uploads
- **Socket.io** - Real-time updates
