// src/components/Auth/ForgetPassword.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Layout, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Comprueba si hay token (usuario logueado)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Maneja el envío del formulario de recuperación
  const onFinish = async (values) => {
    try {
      const data = { email: values.email };
      const res = await axios.post('http://localhost:3004/verifyEmailRecover', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      message.success(res.data);
      // Redirige a la página de verificación de correo, pasando el email y rol
      navigate('/verifyEmail', { state: { email: values.email, role: 'recover' } });
    } catch (error) {
      message.error(error.response?.data || 'Error al enviar el correo de verificación');
    }
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: 20 }}>ConsulTorIa</div>
        {isLoggedIn && (
          <Button type="link" style={{ color: 'white' }} onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        )}
      </Header>
      <Content style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center' }}>Recupera tu cuenta</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Introduce tu correo"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo' },
              { type: 'email', message: 'Correo inválido' },
            ]}
          >
            <Input
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default ForgetPassword;
