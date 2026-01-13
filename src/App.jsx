import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import BoardList from './pages/Board/BoardList';
import BoardWrite from './pages/Board/BoardWrite';
import BoardDetail from './pages/Board/BoardDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminPosts from './pages/Admin/AdminPosts';
import AdminComments from './pages/Admin/AdminComments';
import AdminUsers from './pages/Admin/AdminUsers';
import SubscribePage from './pages/Subscribe/SubscribePage';
import PaymentSuccess from './pages/Subscribe/PaymentSuccess';
import PaymentFail from './pages/Subscribe/PaymentFail';
import FreeTrial from './pages/FreeTrial/FreeTrial';
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
          {/* 관리자 페이지 */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts" element={
            <ProtectedRoute>
              <AdminPosts />
            </ProtectedRoute>
          } />
          <Route path="/admin/comments" element={
            <ProtectedRoute>
              <AdminComments />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          } />
          {/* 구독 및 결제 페이지 */}
          <Route path="/subscribe" element={
            <ProtectedRoute>
              <SubscribePage />
            </ProtectedRoute>
          } />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          {/* 무료 체험 페이지 */}
          <Route path="/free-trial" element={<FreeTrial />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

