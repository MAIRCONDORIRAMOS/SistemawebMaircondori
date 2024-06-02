import React from 'react';
import { Form, Input, Button, Space, Typography, Row, Col, Layout, message } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, IdcardOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;
const endpoint = 'https://back-end-plum.vercel.app/api';

const RegistroCliente = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${endpoint}/cliente`, {
        nombre_usuario: values.correo,
        contra: values.password,
        nombre: values.nombre,
        apellido: values.apellido,
        domicilio: values.domicilio
      });
      message.success('¡Registro Exitoso!');
      navigate('/'); // Redirigir al usuario después de un registro exitoso
    } catch (error) {
      console.error('Error al registrarse:', error);
      message.error('Ocurrió un error al registrarse. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: '600px' }}>
          <IdcardOutlined style={{ fontSize: '48px', color: '#00755c' }} />
          <Title level={2} style={{ textAlign: 'center' }}>Registrar Cliente</Title>
          <div style={{ border: '1px solid #d9d9d9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '5px', padding: '20px' }}>
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor ingresa tu nombre!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nombre" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="apellido"
                    rules={[{ required: true, message: 'Por favor ingresa tu apellido!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Apellido" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="domicilio"
                    rules={[{ required: true, message: 'Por favor ingresa tu domicilio!' }]}
                  >
                    <Input prefix={<HomeOutlined />} placeholder="Domicilio" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="correo"
                    rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico!' }]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Correo electrónico" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
                    hasFeedback
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      { required: true, message: 'Por favor confirma tu contraseña!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Las contraseñas no coinciden!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirma tu contraseña" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Registrarse
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Space>
      </Content>
    </Layout>
  );
};

export default RegistroCliente;
