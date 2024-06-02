import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Pagina from './pagina';
import Login from './Login';
import Dashboard from './Dashboard';
import RegistroCliente from './conponet/Client/RegistroCliente';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <ConfigProvider theme={{
      token: {
        colorBgBase: '#ffffff',
        colorBgContainer: '#ffffff',
        colorPrimary: '#00755c',
        colorInfo: '#6bb39b',
        colorText: '#000000',
        itemSelectedBg: '#00755c',
        itemHoverBg: '#6bb39b'
      },
    }}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Pagina />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/registrarse" element={<RegistroCliente />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
