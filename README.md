# Nexus Learning

A modern Learning Management Platform built for tuition classes and independent learners, featuring real-time collaboration, organized coursework, and seamless communication between students and teachers.

## 🎯 Features

### 👨‍🎓 Students
- Access enrolled classes and materials
- Submit assignments before deadlines
- Personal notes and task management
- Integrated calendar with class schedules
- Live session participation

### 👨‍🏫 Teachers
- Create and manage classes
- Upload content (PDFs, videos, links)
- Schedule and host live sessions
- Track student submissions and progress
- Assignment creation and grading

### 👨‍💼 Administrators
- Complete user and class management
- System analytics and monitoring
- Role-based access control
- Platform configuration

## 🔧 Technology Stack

### Backend
- **Node.js + Express 5 + TypeScript** - API server
- **PostgreSQL** (`pg`, parameterized SQL) - Relational database
- **Zod** - Request validation
- **JWT + bcrypt** - Authentication (compatible with tokens and password hashes from the old Python API)
- **Cloudflare R2** - File storage via signed upload/download URLs

### Hosting
- One **Vercel** project serves the React app and the API under `/api`, with **Neon** (Postgres) and **R2** (files). See `DEPLOYMENT.md`.

### Frontend
- **React.js + TypeScript** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Axios** - API communication
- **React Router** - SPA navigation
- **Heroicons** - Beautiful icons

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL` (or the `POSTGRES_*` values) and `SECRET_KEY`

4. **Setup database** (creates tables and demo users; safe to re-run)
   ```bash
   npm run seed:dev
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🔐 Default Credentials

After running the database setup, you can login with:

- **Admin**: `admin@reactorminds.com` / `admin123`
- **Teacher**: `teacher@example.com` / `teacher123`
- **Student**: `student@example.com` / `student123`

## 📁 Project Structure

```
LMS_2/
├── backend/
│   ├── src/
│   │   ├── routes/       # auth, users, classes handlers
│   │   ├── app.ts        # Express application
│   │   ├── auth.ts       # JWT, password hashing, role guards
│   │   ├── config.ts     # Environment parsing
│   │   ├── db.ts         # Connection pool and schema
│   │   ├── seed.ts       # Database initialization
│   │   └── server.ts     # Entry point
│   └── test/             # API and legacy-compatibility tests
├── e2e/                  # Playwright browser tests
├── shared/types.ts       # Request/response types used by both sides
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── App.tsx       # Main application
│   └── package.json      # Dependencies
└── README.md
```

## 🎨 Design System

### Colors
- **Primary Orange**: `#ff6b35`
- **Secondary Orange**: `#e55a2b`
- **Text White**: `#ffffff`
- **Muted White**: `rgba(255, 255, 255, 0.8)`

### Design Principles
- **Minimalistic**: Clean, distraction-free interface
- **Modern**: Contemporary design patterns
- **Accessible**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first approach

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database (or POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_SERVER / POSTGRES_PORT / POSTGRES_DB)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/LMS

# JWT (keep the old value when migrating so existing sessions stay valid)
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cloudflare R2 (the /files endpoints return 503 until all four are set)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=nexus-learning-files

# In production, a missing SECRET_KEY or database password stops startup
NODE_ENV=production
```

#### Frontend (.env)
Nothing required: the app calls `/api` on its own domain, and `npm start` proxies `/api` to `http://localhost:8000`. Set `REACT_APP_API_URL` only to point at an API elsewhere.

## 📊 API Documentation

Once the backend is running, `http://localhost:8000/docs` (or `/api/docs` when deployed) lists every endpoint and its required role as JSON (it replaces FastAPI's interactive Swagger page). Errors keep FastAPI's `{"detail": ...}` shape.

> Note: the frontend still signs users in with demo accounts (`AuthContext.tsx`); registration calls the real API.

### Testing
```bash
npm run typecheck      # backend + frontend
npm test               # API tests; needs a disposable Postgres at TEST_DATABASE_URL (database name must end in _test)
npm run test:e2e       # Playwright; starts both servers, uses E2E_DATABASE_URL
```

### Key Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /classes/` - Get user's classes
- `POST /classes/` - Create new class
- `GET /users/` - Get all users (admin only)
- `POST /files/upload-url` - Signed URL to upload a file to R2
- `POST /files/download-url` - Signed URL to download your file

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, DigitalOcean, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@reactorminds.com

## 🔮 Future Features

- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Integration with popular video platforms
- [ ] AI-powered learning recommendations
- [ ] Offline content access
- [ ] Multi-language support

---


