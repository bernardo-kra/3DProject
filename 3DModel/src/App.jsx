import React from "react"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import "./assets/theme/index.css"
import PageTest from "./components/PageTest"
import AuthForm from "@components/AuthForm"
import UploadForm from "@components/UploadForm"
import Header from "@components/Home/Header"
import { useAuth } from "./contexts/AuthContext"
import Home from "@components/Home/Home"
import { Loading } from "@common"
import MyProjects from "@components/Profile/MyProjects"
import Profile from "@components/Profile/MyProfile"

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loading isLoading={true} />

  return isAuthenticated ? element : <Navigate to="/login" replace />
}

const App = () => {
  const location = useLocation()
  const { loading } = useAuth()

  if (loading) return <Loading isLoading={true} />

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/register" && <Header />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<ProtectedRoute element={<MyProjects />} />} />
        <Route path="/services" element={<ProtectedRoute element={<div>Serviços</div>} />} />
        <Route path="/my-profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/create-project" element={<ProtectedRoute element={<UploadForm />} />} />
        <Route path="/project/:projectId" element={<ProtectedRoute element={<UploadForm />} />} />
        <Route path="/preferencias" element={<ProtectedRoute element={<div>Preferências</div>} />} />
        <Route path="/register" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/about" element={<div>Sobre</div>} />
        <Route path="/contact" element={<div>Contato</div>} />
        <Route path="/components" element={<PageTest />} />
      </Routes>
    </div>
  )
}

export default App
