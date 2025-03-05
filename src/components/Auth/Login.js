import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya hay token, redirige al dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onFinish = async () => {
    setLoading(true);
    const data = {
      username: user,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:3004/signin', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { auth, token } = response.data;
      if (auth) {
        localStorage.setItem('token', token);
        message.success(`Bienvenido ${user} a ConsulTorIa`);
        // Recargar la página para actualizar el estado y eliminar el panel de login
        window.location.reload();
      }
    } catch (error) {
      message.error(error.response?.data || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 300, margin: '100px auto' }}
    >
      <Form.Item
        label="Usuario"
        name="username"
        rules={[{ required: true, message: 'Ingrese su usuario' }]}
      >
        <Input
          placeholder="Introduce tu usuario"
          value={user}
          onChange={(e) => setUser(e.target.value.trim())}
        />
      </Form.Item>
      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: 'Ingrese su contraseña' }]}
      >
        <Input.Password
          placeholder="Introduce tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          disabled={!user || !password}
        >
          Continuar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
