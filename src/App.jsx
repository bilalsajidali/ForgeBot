import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateBot from './pages/CreateBot'
import EditBot from './pages/EditBot'
import TestBot from './pages/TestBot'

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div className="appShell">
        <Navbar />
        <Outlet />
      </div>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e2431', color: '#e6e9ef' } }} />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div
                  style={{
                    minHeight: '100vh',
                    background: '#050608',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#6b7a94',
                    fontSize: '0.9rem',
                  }}
                >
                  Loading…
                </div>
              }
            >
              <LandingPage />
            </Suspense>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bots/create" element={<CreateBot />} />
          <Route path="/bots/:id/edit" element={<EditBot />} />
          <Route path="/bots/:id/test" element={<TestBot />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
