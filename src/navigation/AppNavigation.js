import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import VerifyEmail from "../components/login/VerifyEmail";
import ForgetPassword from "../components/login/ForgetPassword";
import NewPassword from "../components/login/NewPassword";
import RecordScreen from "../screens/RecordScreen";
import FormScreen from "../screens/FormScreen";
import FormScreenDos from "../screens/FormScreenDos";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AccessAccount from "../components/user/AccessAccount";
import UpdateAccount from "../components/user/UpdateAccount";
import Details from "../screens/Details";
import Consultancies from "../screens/Consultancies";
import UpdateDetails from "../screens/UpdateDetails";
import CustomDrawerContent from "../screens/utils/CustomDrawerContent";
import { RenderHeaderLeft, RenderHeaderRight } from "../screens/utils/CustomStackContent";
import "./App.css"; // Archivo CSS para estilos

const App = () => {
  const [user, setUser] = useState(false); // Simula el estado de autenticación

  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
          </>
        )}

        {/* Rutas principales */}
        {user && (
          <>
            <Route path="/" element={<MainDrawers />} />
            <Route path="/consultancies/:id" element={<Consultancies />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/update-details/:id" element={<UpdateDetails />} />
            <Route path="/form" element={<FormScreen />} />
            <Route path="/form-dos" element={<FormScreenDos />} />
            <Route path="/record" element={<RecordScreen />} />
            <Route path="/access-account" element={<AccessAccount />} />
            <Route path="/update-account" element={<UpdateAccount />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}

        {/* Ruta por defecto */}
        <Route path="*" element={user ? <MainDrawers /> : <Login />} />
      </Routes>
    </Router>
  );
};

const MainDrawers = () => {
  return (
    <div className="main-drawer">
      <CustomDrawerContent />
      <Main />
    </div>
  );
};

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="main">
      <div className="header">
        <RenderHeaderLeft route={location} navigation={navigate} />
        <h1 className="title">
          {location.pathname === "/" && "ConsulTorIa"}
          {location.pathname.startsWith("/consultancies") && "Consultoría"}
          {location.pathname.startsWith("/details") && "Detalles"}
          {location.pathname.startsWith("/update-details") && "Actualizar Detalles"}
          {location.pathname.startsWith("/form") && "Nueva Observación"}
          {location.pathname.startsWith("/record") && "Grabación de Pantalla"}
          {location.pathname.startsWith("/access-account") && "Cuenta"}
          {location.pathname.startsWith("/update-account") && "Actualizar Cuenta"}
          {location.pathname.startsWith("/profile") && "Perfil"}
        </h1>
        <RenderHeaderRight route={location} navigation={navigate} />
      </div>
      <Routes>
        <Route path="/" element={<MainTopTab />} />
        <Route path="/consultancies/:id" element={<Consultancies />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/update-details/:id" element={<UpdateDetails />} />
        <Route path="/form" element={<FormScreen />} />
        <Route path="/form-dos" element={<FormScreenDos />} />
        <Route path="/record" element={<RecordScreen />} />
        <Route path="/access-account" element={<AccessAccount />} />
        <Route path="/update-account" element={<UpdateAccount />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

const MainTopTab = () => {
  const [isUpdateFolderData, setIsUpdateFolderData] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="main-top-tab">
      <div className="tabs">
        <Link to="/" className="tab">
          Todo
        </Link>
        <Link to="/my-consultancies" className="tab">
          Mis Consultorías
        </Link>
        <Link to="/collaborations" className="tab">
          Colaboraciones
        </Link>
      </div>
      <Home isUpdateFolderData={isUpdateFolderData} />
      <button
        className="floating-button"
        onClick={() => {
          setIsUpdateFolderData(true);
          navigate("/form");
        }}
      >
        +
      </button>
    </div>
  );
};

export default App;