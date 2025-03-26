  import React, { useState, useEffect } from "react";
  import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    useNavigate,
    Outlet,
  } from "react-router-dom";
  import styled from "styled-components";
  import { FiPlus, FiMoreVertical } from "react-icons/fi";

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

  // Componente Drawer (menú plegable)
  // Asegúrate de que el Drawer esté adaptado a web y con un estilo "bonito"
  import Drawer from "./screens/utils/CustomDrawerContent";

  // Layout principal que simula un header personalizado con un tab superior
  const MainLayout = ({ onLogout }) => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
      <LayoutContainer>
        <Header>
          <Nav>
            <StyledLink to="/home">Inicio</StyledLink>
            <StyledLink to="/consultancies">Consultorías</StyledLink>
          </Nav>
          <HeaderRight>
            {/* Botón de 3 puntitos para desplegar el menú */}
            <button
            color=" #3366ff;"
              className="header-drawer-toggle"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <FiMoreVertical size={30} color="white" />
            </button>
          </HeaderRight>
        </Header>
        <Content>
          {isDrawerOpen && <Drawer />}
          <Outlet />
        </Content>
        <FloatingButton onClick={() => navigate("/form-screen")}>
          <FiPlus size={25} />
        </FloatingButton>
      </LayoutContainer>
    );
  };

  const AppNavigation = () => {
    const [user, setUser] = useState(true);
    const navigate = useNavigate();

    // useEffect(() => {
    //   if (user) {
    //     navigate("/");
    //   }
    // }, [user, navigate]);

    const handleLogout = () => {
      // Aquí podrías limpiar tokens, etc.
      setUser(false);
      navigate("/");
    };

    return (
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
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
              <Route path="drawer" element={<Drawer />} />
            </Route>
          </>
        ) : (
          <Route path="*" element={<MainLayout onLogout={handleLogout} />}>
            <Route path="home" element={<Home />} />
            <Route path="consultancies" element={<Consultancies />} />
            <Route path="details" element={<Details />} />
            <Route path="update-details" element={<UpdateDetails />} />
            <Route path="form-screen" element={<FormScreen />} />
            <Route path="form-screen-dos" element={<FormScreenDos />} />
            <Route path="record-screen" element={<RecordScreen />} />
            <Route path="access-account" element={<AccessAccount />} />
            <Route path="update-account" element={<UpdateAccount />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="drawer" element={<Drawer />} />
          </Route>
        )}
        <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
      </Routes>
    );
  };

  export default function App() {
    return (
      <BrowserRouter>
        <AppNavigation />
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

  const HeaderRight = styled.div`
    display: flex;
    align-items: center;
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
