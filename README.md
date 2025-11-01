# Nexus Learning by Reactor Minds

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
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **JWT** - Secure authentication
- **Firebase Storage** - File storage and management

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Axios** - API communication
- **React Router** - SPA navigation
- **Heroicons** - Beautiful icons

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Firebase account (for file storage)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Add Firebase configuration

5. **Setup database**
   ```bash
   python setup_db.py
   ```

6. **Start the server**
   ```bash
   uvicorn main:app --reload
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
│   ├── routers/           # API route handlers
│   ├── models.py          # Database models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py           # Authentication utilities
│   ├── database.py       # Database configuration
│   ├── firebase_utils.py # Firebase integration
│   ├── config.py         # Application configuration
│   ├── main.py           # FastAPI application
│   └── setup_db.py       # Database initialization
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── App.js        # Main application
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
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=LMS

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Firebase
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8000
```

## 📊 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /classes/` - Get user's classes
- `POST /classes/` - Create new class
- `GET /users/` - Get all users (admin only)

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

Built with ❤️ by the Reactor Minds team
