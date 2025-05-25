import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages and Components
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import PostDetails from './pages/PostDetails';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import EditPost from './pages/EditPost';
import PrivateRoute from './components/PrivateRoute'; // Import the wrapper

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/myposts"
          element={
            <PrivateRoute>
              <MyPosts />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* PostDetails remains public */}
        <Route path="/posts/:id" element={<PostDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
