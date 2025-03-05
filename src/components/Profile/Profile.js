// src/components/Profile/Profile.js
import React, { useEffect, useState } from 'react';
import { Card, Avatar, Spin, message } from 'antd';
import api from '../../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/me')
      .then((res) => setUser(res.data))
      .catch((err) => {
        message.error('Error al cargar el perfil');
      });
  }, []);

  if (!user) return <Spin />;

  return (
    <Card style={{ maxWidth: 400, margin: '20px auto' }}>
      <Card.Meta
        avatar={<Avatar src={user.photo} size={64} />}
        title={`${user.name} ${user.lastname}`}
        description={`Usuario: ${user.username}\nCorreo: ${user.email}`}
      />
    </Card>
  );
};

export default Profile;
