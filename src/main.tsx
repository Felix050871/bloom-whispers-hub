import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Index from './pages/Index.tsx'
import NotFound from './pages/NotFound.tsx'
import { Auth } from './pages/Auth.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { Toaster } from "./components/ui/toaster"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Index /></ProtectedRoute>,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </StrictMode>,
)