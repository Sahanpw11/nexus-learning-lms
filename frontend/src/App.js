import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import Assignments from './pages/Assignments';
import AssignmentDetails from './pages/AssignmentDetails';
import Calendar from './pages/Calendar';
import EventCreator from './pages/EventCreator';
import LiveSessions from './pages/LiveSessions';
import ScheduleSession from './pages/ScheduleSession';
import SessionDetail from './pages/SessionDetail';
import RecordingViewer from './pages/RecordingViewer';
import Notes from './pages/Notes';
import NoteEditor from './pages/NoteEditor';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentProfile from './pages/StudentProfile';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import ClassAnalyticsDetails from './pages/ClassAnalyticsDetails';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />            <Route 
                path="/classes" 
                element={
                <ProtectedRoute>
                  <Classes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/class/:classId" 
              element={
                <ProtectedRoute>
                  <ClassDetail />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/assignment/:assignmentId" 
              element={
                <ProtectedRoute>
                  <AssignmentDetails />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/event-creator" 
              element={
                <ProtectedRoute>
                  <EventCreator />
                </ProtectedRoute>
              } 
            /><Route 
              path="/live-sessions" 
              element={
                <ProtectedRoute>
                  <LiveSessions />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/schedule-session" 
              element={
                <ProtectedRoute>
                  <ScheduleSession />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/session/:sessionId" 
              element={
                <ProtectedRoute>
                  <SessionDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recording/:sessionId" 
              element={
                <ProtectedRoute>
                  <RecordingViewer />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/notes" 
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/note/new" 
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/note/:noteId" 
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/students" 
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/add-student" 
              element={
                <ProtectedRoute>
                  <AddStudent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/:studentId" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/users" 
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } 
            />            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/class/:classId" 
              element={
                <ProtectedRoute>
                  <ClassAnalyticsDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
