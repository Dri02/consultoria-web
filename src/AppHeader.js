// src/AppHeader.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica si existe el token para determinar si el usuario está autenticado
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Header>
      <div style={{ color: 'white', fontSize: 20, float: 'left', marginRight: 20 }}>
        ConsulTorIa
      </div>
      <Menu theme="dark" mode="horizontal" style={{ flex: 1 }}>
        
        {isLoggedIn && (
          <>
            <Menu.Item key="home">
              <Link to="/">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="profile">
              <Link to="/profile">Perfil</Link>
            </Menu.Item>
            <Menu.Item
              key="logout"
              style={{ marginLeft: 'auto' }} // Empuja este item a la derecha
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Menu.Item>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Menu.Item key="login" style={{ marginLeft: 'auto' }}>
              <Link to="/login">Iniciar Sesión</Link>
            </Menu.Item>
            <Menu.Item key="signup">
              <Link to="/signup">Registrarse</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
};

export default AppHeader;
