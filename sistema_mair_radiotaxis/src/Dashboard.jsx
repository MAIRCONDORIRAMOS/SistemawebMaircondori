import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button, Card } from 'antd';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  IdcardOutlined,
  SolutionOutlined,
  FileTextOutlined,
  CarOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { FaCottonBureau } from 'react-icons/fa';
import Cliente from './conponet/Cliente';
import General from './conponet/General';
import SociosChoferes from './conponet/SociosChoferes';
import Usuarios from './conponet/Usuarios';
import Reportaje from './conponet/Reportaje';
import Viajes from './conponet/Viajes';
import HojaRuta from './conponet/HojaRuta';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const { Header, Content, Sider } = Layout;
const endpoint = 'https://back-end-plum.vercel.app/api';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [datos, setDatos] = useState(null);
  const [idsesion, setIdsesion] = useState('');
  const [nombre, setNombre] = useState('');
  const [Ci, setCi] = useState('');
  const [Licencia, setLicencia] = useState('');
  const [tipo, setTipo] = useState('');
  const location = useLocation();
  const { username, password, Rol } = location.state || {};
  const [placa, setPlaca] = useState('');
  const [id_chofer_socio, setIdChoferSocio] = useState('');

  const { logout } = useAuth();

  useEffect(() => {
    const login = async () => {
      try {
        const response = await axios.get(`${endpoint}/usuario/login/${username}/${password}`);
        setIdsesion(response.data.id);
        setNombre(response.data.Nombre);
        setCi(response.data.CI);
        setLicencia(response.data.Licencia);
        setTipo(Rol);
        setPlaca(response.data.Placa);
        setIdChoferSocio(response.data.id_socio_chofer);
        if (Rol === 'CLIENTE') {
          setSelectedMenuItem('Cliente');
        } else if (Rol === 'USUARIO') {
          setSelectedMenuItem('HojasDeRutas');
        } else if (Rol === 'ADMINISTRADOR') {
          setSelectedMenuItem('General');
        }
      } catch (error) {
        console.error('Error al obtener datos ', error);
      }
    };
    login();
  }, [username, password, Rol]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuSelect = (item) => {
    setSelectedMenuItem(item.key);
  };

  const handleUserMenuClick = (item) => {
    if (item.key === 'ShowUserInfo') {
      setShowUserInfo(true);
    }
  };

  const menuItems = [
    { key: 'General', icon: <FaCottonBureau />, label: 'General', component: <General /> },
    { key: 'Socios', icon: <IdcardOutlined />, label: 'Socios y choferes', component: <SociosChoferes /> },
    { key: 'Usuarios', icon: <UserOutlined />, label: 'Usuarios', component: <Usuarios /> },
    { key: 'Reportajes', icon: <SolutionOutlined />, label: 'Reportajes', component: <Reportaje /> },
    { key: 'HojasDeRutas', icon: <FileTextOutlined />, label: 'Hojas de Rutas', component: <HojaRuta placa={placa} /> },
    { key: 'Viajes', icon: <CarOutlined />, label: 'Viajes', component: <Viajes id_chofer_socio={id_chofer_socio} /> },
    { key: 'Cliente', icon: <TeamOutlined />, label: 'Cliente', component: <Cliente idsesion={idsesion} /> },
  ];

  let visibleMenuItems = [];
  if (tipo === 'CLIENTE') {
    visibleMenuItems = menuItems.filter(item => item.key === 'Cliente');
  } else if (tipo === 'USUARIO') {
    visibleMenuItems = menuItems.filter(item => item.key === 'HojasDeRutas' || item.key === 'Viajes');
  } else if (tipo === 'ADMINISTRADOR') {
    visibleMenuItems = menuItems.filter(item => item.key !== 'Cliente' && item.key !== 'Viajes' && item.key !== 'HojasDeRutas');
  }

  const userMenu = (
    <Menu>
      {tipo === 'CLIENTE' ? (
        <Card title="Información del usuario">
          <p>id : {idsesion}</p>
          <p>Nombre: {nombre}</p>
          <p>Tipo: {tipo}</p>
        </Card>
      ) : (
        <Card title="Información del usuario">
          <p>id : {idsesion}</p>
          <p>Nombre: {nombre}</p>
          <p>CI: {Ci}</p>
          <p>Licencia: {Licencia}</p>
          <p>Tipo: {tipo}</p>
          <p>Placa: {placa}</p>
        </Card>
      )}
      <Menu.Item key="Logout" icon={<LogoutOutlined />} onClick={logout}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '97vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        triggerBg='#00755c'
        style={{ backgroundColor: '#fff', paddingTop: '16px' }} // Ajuste aquí
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}> {/* Ajuste aquí */}
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{
                cursor: 'pointer',
                backgroundColor: '#00755c',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                border: '2px solid #fff',
              }}
            />
          </Dropdown>
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['General']}
          selectedKeys={[selectedMenuItem]}
          onSelect={handleMenuSelect}
        >
          {visibleMenuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} style={{ margin: 0, position: 'relative' }}>
              {item.label}
              {selectedMenuItem === item.key && <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 4, backgroundColor: '#1890ff' }} />}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ margin: '0 5px ', padding: 0, backgroundColor: '#fff', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h1 style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>{selectedMenuItem}</h1>
        </Header>
        <Content style={{ margin: '5px 5px 0' }}>
          <div
            style={{
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              maxHeight: 'calc(100vh - 80px)', // Ajuste aquí, 80px es la altura aproximada del encabezado
              overflow: 'auto',
            }}
          >
            {selectedMenuItem && (
              <div>
                {menuItems.find((item) => item.key === selectedMenuItem)?.component}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
