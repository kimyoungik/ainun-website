import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import BoardList from './pages/Board/BoardList';
import BoardWrite from './pages/Board/BoardWrite';
import BoardDetail from './pages/Board/BoardDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/board" element={<BoardList />} />
          <Route path="/board/write" element={
            <ProtectedRoute>
              <BoardWrite />
            </ProtectedRoute>
          } />
          <Route path="/board/:id" element={
            <ProtectedRoute>
              <BoardDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
