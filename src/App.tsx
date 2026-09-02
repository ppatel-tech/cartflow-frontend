import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProductListPage } from './pages/ProductListPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartProvider } from './context/CartContext'
import { CartPage } from './pages/CartPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AddressPage } from './pages/AddressPage'
import { ToastProvider } from './context/ToastContext'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { WishlistPage } from './pages/WishlistPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { PaymentPage } from './pages/PaymentPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { AdminRoute } from './routes/AdminRoute'
import { AdminLayout } from './layouts/AdminLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminReportsPage } from './pages/admin/AdminReportsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<AdminDashboardPage />} />
                        <Route path="/orders" element={<AdminOrdersPage />} />
                        <Route path="/users" element={<AdminUsersPage />} />
                        <Route path="/reports" element={<AdminReportsPage />} />
                      </Routes>
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/*"
                element={

                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductListPage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                      <Route path="*" element={<NotFoundPage />} />
                      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                      <Route path="/addresses" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
                      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                    </Routes>
                  </MainLayout>
                }
              />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App