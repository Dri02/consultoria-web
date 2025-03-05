// src/components/Auth/Login.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/signin', values);
      localStorage.setItem('token', res.data.token);
      message.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 300, margin: '100px auto' }}
    >
      <Form.Item name="username" label="Usuario" rules={[{ required: true, message: 'Ingrese su usuario' }]}>
        <Input placeholder="Usuario" />
      </Form.Item>
      <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Ingrese su contraseña' }]}>
        <Input.Password placeholder="Contraseña" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
