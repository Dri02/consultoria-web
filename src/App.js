// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
/*import Profile from './components/Profile/Profile';
import NotFound from './pages/NotFound';*/

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" style={{ color: 'white', fontSize: 20 }}>
            ConsulTorIa
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
            <Menu.Item key="home">
              <a href="/">Inicio</a>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <a href="/dashboard">Dashboard</a>
            </Menu.Item>
            <Menu.Item key="profile">
              <a href="/profile">Perfil</a>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ConsulTorIa Web ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
