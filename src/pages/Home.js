// src/pages/Home.js
import React, { useState, useEffect } from 'react';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn) {
    // Panel en blanco cuando el usuario está autenticado
    return <div style={{ padding: '50px', textAlign: 'center' }}></div>;
  }

  // Contenido público para usuarios no autenticados (puedes personalizarlo)
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Bienvenido a ConsulTorIa</h1>
      <p>Esta es la página de inicio pública.</p>
    </div>
  );
};

export default Home;
