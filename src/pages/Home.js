// src/pages/Home.js
import React from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Title>Bienvenido a ConsulTorIa Web</Title>
      <Paragraph>
        Plataforma para la gestión de observaciones en consultoría TI.
      </Paragraph>
      <Button type="primary" onClick={() => navigate('/login')}>
        Iniciar Sesión
      </Button>
      <Button style={{ marginLeft: 10 }} onClick={() => navigate('/signup')}>
        Registrarse
      </Button>
    </div>
  );
};

export default Home;
