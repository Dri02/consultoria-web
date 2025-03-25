import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";

// Componentes de autenticación
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import VerifyEmail from "./components/login/VerifyEmail";
import ForgetPassword from "./components/login/ForgetPassword";
import NewPassword from "./components/login/NewPassword";

// Pantallas principales
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import AccessAccount from "./components/user/AccessAccount";
import UpdateAccount from "./components/user/UpdateAccount";
import Details from "./screens/Details";
import Consultancies from "./screens/Consultancies";
import UpdateDetails from "./screens/UpdateDetails";
import RecordScreen from "./screens/RecordScreen";
import FormScreen from "./screens/FormScreen";
import FormScreenDos from "./screens/FormScreenDos";

// Layout principal que simula Drawer/TopTab y header personalizado
const MainLayout = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <LayoutContainer>
      <Header>
        <Nav>
          <StyledLink to="/home">Inicio</StyledLink>
          <StyledLink to="/consultancies">Consultorías</StyledLink>
          <StyledLink to="/profile">Cuenta</StyledLink>
        </Nav>
        <LogoutButton onClick={onLogout}>Cerrar Sesión</LogoutButton>
      </Header>
      <Content>
        {/* Aquí se renderizan las rutas hijas */}
        <Outlet />
      </Content>
      <FloatingButton onClick={() => navigate("/form-screen")}>
        <FiPlus size={25} />
      </FloatingButton>
    </LayoutContainer>
  );
};

// Componente principal de la App
export default function AppNavigation() {
  // Simulación de estado de autenticación (puedes integrarlo con tu lógica real)
  const [user, setUser] = useState(true); // Puedes ajustar el valor inicial para probar

  // Función para cerrar sesión (por ejemplo, limpiar tokens, etc.)
  const handleLogout = () => {
    setUser(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación */}
        {!user && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            {/* Ruta fallback para redirigir al login */}
            <Route path="*" element={<Login />} />
          </>
        )}

        {/* Rutas protegidas */}
        {user && (
          <Route path="/" element={<MainLayout onLogout={handleLogout} />}>
            <Route path="home" element={<Home />} />
            <Route path="consultancies" element={<Consultancies />} />
            <Route path="details" element={<Details />} />
            <Route path="update-details" element={<UpdateDetails />} />
            <Route path="form-screen" element={<FormScreen />} />
            <Route path="form-screen-dos" element={<FormScreenDos />} />
            <Route path="record-screen" element={<RecordScreen />} />
            <Route path="access-account" element={<AccessAccount />} />
            <Route path="update-account" element={<UpdateAccount />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )}

        {/* Ruta fallback: si la ruta no existe, redirige al login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

// Estilos con styled-components

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Header = styled.header`
  background-color: #3366ff;
  padding: 10px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: #3366ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
