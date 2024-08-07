import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import CreateBlog from './pages/CreateBlog';

function App() {
  return (
    <div>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-blog" element={<CreateBlog />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
