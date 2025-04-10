  import React, { useState, useEffect, useRef } from "react";
  import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    useNavigate,
    Outlet,
    useLocation,
  } from "react-router-dom";
  import styled from "styled-components";
  import { FiPlus, FiMoreVertical, FiArrowLeft } from "react-icons/fi";

  // Componentes de autenticación
  import Login from "./components/login/Login";
  import Register from "./components/login/Register";
  import VerifyEmail from "./components/login/VerifyEmail";
  import ForgetPassword from "./components/login/ForgetPassword";
  import NewPassword from "./components/login/NewPassword";

  // Pantallas principales
  import Home from "./screens/Home";
  import MyConsulties from "./screens/MyConsulties";
  import Collaborations from "./screens/Collaborations"
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
  import Drawer from "./screens/utils/CustomDrawerContent";

  // Layout principal que simula un header personalizado con un tab superior
  const MainLayout = ({ onLogout }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const drawerRef = useRef(null); // Ref para el drawer
    const toggleButtonRef = useRef(null); // Ref para el botón de toggle

    // Efecto para detectar clics fuera del drawer
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (isDrawerOpen && !drawerRef.current?.contains(event.target) && !toggleButtonRef.current?.contains(event.target)) {
          setIsDrawerOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDrawerOpen]);

    return (
      <LayoutContainer>
        <Header>
          <Nav>
            <StyledLink to="/home" name="Home" key={"Home"}>Todo</StyledLink>
            <StyledLink to="/consulties" name="MyConsultancies" key={"MyConsultancies"}>Mis Consultorías</StyledLink>
            <StyledLink to="/collaborations" name="Collaborations" key={"Collaborations"}>Colaboraciones</StyledLink>
          </Nav>
          <HeaderRight>
            <button
            ref={toggleButtonRef}
            style={styles.optionButton}
            className="header-drawer-toggle"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <FiMoreVertical size={30} color="white" />
            </button>
          </HeaderRight>
        </Header>
  
        <Content>
          {isDrawerOpen && (<div ref={drawerRef}> 
            <Drawer />
          </div>
        )}
  
          {/* Aquí envolvemos el Outlet con un contenedor 
              que incluya el BackArrowIfNotHome */}
          <div className="page-container">
            <BackArrowIfNotHome />
            <Outlet />
          </div>
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
              <Route path="home" element={<Home />}/>
              <Route path="consulties" element={<MyConsulties />} />
              <Route path="collaborations" element={<Collaborations />} />
              <Route path="myconsulties" element={<Consultancies />} />
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
            <Route path="consulties" element={<MyConsulties />} />
            <Route path="myconsulties" element={<Consultancies />} />
            <Route path="collaborations" element={<Collaborations />} />
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
            <Route path="verify-email" element={<VerifyEmail />} />
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

  function BackArrowIfNotHome() {
    const location = useLocation();
    const navigate = useNavigate();
  
    // Si la ruta actual es "/home", no mostramos nada
    if (location.pathname === "/home" || location.pathname === "/consulties" || location.pathname === "/collaborations")
       return null;
  
    // Si estamos en otra ruta, mostramos la flecha
    return (
      <div style={{ marginBottom: "1rem" }}>
        <FiArrowLeft 
          size={24} 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate(-1)} 
        />
      </div>
    );
  }

  export default function App() {
    return (
      <BrowserRouter>
        <AppNavigation />
      </BrowserRouter>
    );
  }

  // Estilos con styled-components

  const styles ={
    optionButton: {
      padding: "10px 20px",
      background: " #3366ff",
      border: "none",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
    },
  }
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
