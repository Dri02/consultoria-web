// src/components/Auth/Signup.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/signup', values);
      localStorage.setItem('token', res.data.token);
      message.success('Registro exitoso');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="signup"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 300, margin: '100px auto' }}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Ingrese su nombre' }]}>
        <Input placeholder="Nombre" />
      </Form.Item>
      <Form.Item name="lastname" label="Apellido" rules={[{ required: true, message: 'Ingrese su apellido' }]}>
        <Input placeholder="Apellido" />
      </Form.Item>
      <Form.Item name="username" label="Usuario" rules={[{ required: true, message: 'Ingrese un usuario' }]}>
        <Input placeholder="Usuario" />
      </Form.Item>
      <Form.Item name="email" label="Correo" rules={[{ required: true, message: 'Ingrese su correo', type: 'email' }]}>
        <Input placeholder="Correo" />
      </Form.Item>
      <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Ingrese su contraseña' }]}>
        <Input.Password placeholder="Contraseña" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Registrarse
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Signup;
