import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "@context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@common"
import { FiUser, FiLogOut, FiHome, FiPlusSquare, FiSettings, FiLayers, FiFolder } from "react-icons/fi"
import BKArchitectureLogo from "@common/Logo"
import { motion } from "framer-motion"
import "./styles.css"

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const avatarRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      avatarRef.current &&
      !avatarRef.current.contains(event.target)
    ) {
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <motion.header className="Header" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>
      <div className="Header-content">
        <div className="Header-logo" onClick={() => navigate("/home")}>
          <BKArchitectureLogo size={40} />
        </div>

        <nav className="Header-nav">
          <Button text="Home" icon={<FiHome />} onClick={() => navigate("/home")} />
          <Button text="Projetos" icon={<FiLayers />} onClick={() => navigate("/projects")} />
          <Button text="Serviços" onClick={() => navigate("/services")} />
          <Button text="Contato" onClick={() => navigate("/contact")} />

          {isAuthenticated ? (
            <div className="Header-avatarWrapper">
              <div onClick={toggleMenu} ref={avatarRef} className="Header-avatarContainer">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Foto do Usuário"
                    className="Header-avatarImage"
                  />
                ) : (
                  <FiUser className="Header-userIcon" />
                )}
                <p className="Header-username">{user?.firstName || "Usuário"}</p>
              </div>
              {menuOpen && (
                <motion.div
                  ref={menuRef}
                  className={`Header-menu`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button text="Meu Perfil" icon={<FiUser />} onClick={() => navigate("/my-profile")} />
                  <Button text="Meus Projetos" icon={<FiFolder />} onClick={() => navigate("/projects")} />
                  <Button text="Adicionar Projeto" icon={<FiPlusSquare />} onClick={() => navigate("/create-project")} />
                  <Button text="Preferências" icon={<FiSettings />} onClick={() => navigate("/preferencias")} />
                  <Button text="Logout" icon={<FiLogOut />} onClick={handleLogout} />
                </motion.div>
              )}
            </div>
          ) : (
            <Button text="Logar" onClick={() => navigate("/login")} />
          )}
        </nav>
      </div>
    </motion.header>
  )
}

export default Header
