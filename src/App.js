import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { FiPlus, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import styled from "styled-components";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import VerifyEmail from "./components/login/VerifyEmail";
import ForgetPassword from "./components/login/ForgetPassword";
import NewPassword from "./components/login/NewPassword";
import RecordScreen from "./screens/RecordScreen";
import FormScreen from "./screens/FormScreen";
import FormScreenDos from "./screens/FormScreenDos";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import AccessAccount from "./components/user/AccessAccount";
import UpdateAccount from "./components/user/UpdateAccount";
import Details from "./screens/Details";
import Consultancies from "./screens/Consultancies";
import UpdateDetails from "./screens/UpdateDetails";
import CustomDrawerContent from "./screens/utils/CustomDrawerContent";

// Componente principal
export default function App() {
  const user = false; // Simula el estado de autenticación

  return (
    <BrowserRouter>
      <AppContainer>
        {user ? (
          <MainDrawers />
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/home" element={<MainDrawers />} /> {/* Fix: Use path="*" */}
          </Routes>
        )}
      </AppContainer>
    </BrowserRouter>
  );
}

// Drawer y contenido principal
const MainDrawers = () => {
  return (
    <AppContainer>
      <Routes>
        <Route path="/home" element={<MainTopTab />} />
        <Route path="/consultancies/:id" element={<Consultancies />} />
        <Route path="/details" element={<Details />} />
        <Route path="/update-details" element={<UpdateDetails />} />
        <Route path="/form-screen" element={<FormScreen />} />
        <Route path="/form-screen-dos" element={<FormScreenDos />} />
        <Route path="/record-screen" element={<RecordScreen />} />
        <Route path="/access-account" element={<AccessAccount />} />
        <Route path="/update-account" element={<UpdateAccount />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppContainer>
  );
};

// Pestañas superiores
const MainTopTab = () => {
  const [isUpdateFolderData, setIsUpdateFolderData] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppContainer>
      <TopTabs>
        <Tab to="/" active="true"> {/* Fix: Pass active as a string */}
          Todo
        </Tab>
        <Tab to="/consultancies" active="false"> {/* Fix: Pass active as a string */}
          Mis Consultorías
        </Tab>
        <Tab to="/collaborations" active="false"> {/* Fix: Pass active as a string */}
          Colaboraciones
        </Tab>
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FiPlus size={20} />
        </MenuButton>
        {isMenuOpen && (
          <DropdownMenu>
            <DropdownItem onClick={() => navigate("/profile")}>
              <FiUser size={16} />
              <span>Perfil</span>
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/update-account")}>
              <FiSettings size={16} />
              <span>Ajustes</span>
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/")}>
              <FiLogOut size={16} />
              <span>Cerrar sesión</span>
            </DropdownItem>
          </DropdownMenu>
        )}
      </TopTabs>
      <MainContent>
        <Home isUpdateFolderData={isUpdateFolderData} />
      </MainContent>
      <Button
        onClick={() => {
          setIsUpdateFolderData(true);
          navigate("/form-screen");
        }}
      >
        <FiPlus size={25} />
      </Button>
    </AppContainer>
  );
};

// Estilos con styled-components
const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color:rgb(91, 117, 202);
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const TopTabs = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const Tab = styled(Link).attrs((props) => ({
  active: props.active ? "true" : "false", // Fix: Convert boolean to string
}))`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${(props) => (props.active === "true" ? "#3366ff" : "#f4f4f4")};
  color: ${(props) => (props.active === "true" ? "white" : "#333")};
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active === "true" ? "#3366ff" : "#ddd")};
  }
`;

const MenuButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f4f4f4;
  }

  span {
    margin-left: 10px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;