import React, { useState } from 'react';
import { Button, Input, Form, Row, Col, Carousel, Typography, Image, message, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from './img.jpeg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const { Text, Link, Title } = Typography;

const endpoint = 'https://back-end-plum.vercel.app/api';

const Login = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const { username, password } = values;

      // Realiza la solicitud al backend para validar el usuario y contraseña
      const response = await axios.get(`${endpoint}/usuario/login/${username}/${password}`);
      const Rol = response.data.Rol;

      // Si la solicitud es exitosa y el usuario existe, redirige al usuario al panel de control
      alert(response.data.Rol);
      login();
      navigate('/dashboard', { state: { username, password, Rol } });
    } catch (error) {
      // Si la solicitud falla o el usuario no existe, muestra un mensaje de error
      message.error('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f5ed' }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div style={{ maxWidth: '400px', width: '100%', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Spin spinning={loading}>
            <Row justify="center">
              <Col>
                <Image width={200} src={Logo} preview={false} />
              </Col>
            </Row>
            <Title><h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#264653' }}>Inicia Sesión</h1></Title>
            <Form form={form} onFinish={handleLogin}>
              <Form.Item name="username">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Input
                    placeholder="Usuario"
                    prefix={<FaUser />}
                    size="large"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                  />
                </motion.div>
              </Form.Item>
              <Form.Item name="password">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Input.Password
                    placeholder="Contraseña"
                    prefix={<FaLock />}
                    size="large"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                  />
                </motion.div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ backgroundColor: '#264653', borderColor: '#264653' }}
                  animate={{ scale: [1, 1.05, 1], transition: { duration: 0.3 } }}
                >
                  Ingresar
                </Button>
              </Form.Item>
              <Button type="link" onClick={() => navigate('/registrarse')}>
                Regístrate ahora!
              </Button>
            </Form>
            <Text>
              <p style={{ textAlign: 'center', color: '#264653' }}>
                Sindicato Mixto de Taxis Banderitas verdes
              </p>
            </Text>
          </Spin>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
