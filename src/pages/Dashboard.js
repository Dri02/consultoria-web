// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { List, Typography, Spin, message } from 'antd';
import api from '../services/api';

const Dashboard = () => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada a un endpoint que devuelva las observaciones
    api.get('/api/observation')
      .then((res) => {
        setObservations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error('Error al cargar las observaciones');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin />;

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={2}>Observaciones</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={observations}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={`Tipo: ${item.type} - Fecha: ${item.dateTime}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Dashboard;
