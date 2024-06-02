import React from 'react';
import { Layout, Menu, Button, Row, Col, Typography } from 'antd';
import { HomeOutlined, TeamOutlined, EnvironmentOutlined, PhoneOutlined, LoginOutlined, FacebookOutlined, WhatsAppOutlined, TwitterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Link as ScrollLink, Element } from 'react-scroll';
import Logo from './img.jpeg';
const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Pagina = () => {
  const navigate = useNavigate();

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" style={{ float: 'left' }}>
          <img
            src="https://cdn.glitch.global/3eb83738-d70d-4799-aad0-031110101c71/marca-removebg-preview.png?v=1699734598020"
            alt="Logo"
            style={{ height: '64px' }}
          />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
          <Menu.Item key="home">
            <ScrollLink to="home" smooth={true} duration={500}>
              <HomeOutlined /> PRINCIPAL
            </ScrollLink>
          </Menu.Item>
          <Menu.Item key="orga">
            <ScrollLink to="orga" smooth={true} duration={500}>
              <TeamOutlined /> NUESTRA ORGANIZACION
            </ScrollLink>
          </Menu.Item>
          <Menu.Item key="oficina">
            <ScrollLink to="oficina" smooth={true} duration={500}>
              <EnvironmentOutlined /> NUESTRA OFICINA
            </ScrollLink>
          </Menu.Item>
          <Menu.Item key="contact">
            <ScrollLink to="contact" smooth={true} duration={500}>
              <PhoneOutlined /> CONTACTOS
            </ScrollLink>
          </Menu.Item>
          <Menu.Item key="login" onClick={() => navigate('/login')}>
            <LoginOutlined /> ACCESO
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Element name="home">
            <section id="home" style={{ textAlign: 'center', padding: '50px 0' }}>
              <Title>ASOCIACIÓN DE TRANSPORTE MIXTO</Title>
              <Title level={2}>16 DE JULIO “BANDERITAS VERDES” A.T.L.</Title>
              <Paragraph>Nuestra organización ofrece servicio de trufi taxi en la Localidad de Llallagua.</Paragraph>
              <Button type="primary" size="large">Ver Mas</Button>
            </section>
          </Element>
          <Element name="orga">
            <section id="orga" style={{ padding: '50px 0' }}>
              <Title level={2}>NUESTRA ORGANIZACION</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <img src={Logo} alt="Organización" style={{ width: '100%' }} />
                </Col>
                <Col xs={24} md={12}>
                  <Title level={3}>QUIENES SOMOS?</Title>
                  <Paragraph>Nuestra organización esta compuesta por:</Paragraph>
                  <Paragraph>
                    <b>Departamento Operativo:</b> Staff de operadores ampliamente calificado, para que al momento de solicitar un viaje
                    sea atendido con la rapidez y cordialidad que usted se merece.
                  </Paragraph>
                  <Paragraph>
                    <b>Departamento de Atención al Cliente:</b> Esta a su disposición para resolver todas sus inquietudes y asesorarlo sobre la extensa gama de servicios que
                    Buen Viaje le ofrece.
                  </Paragraph>
                  <Paragraph>
                    <b>Departamento de Móviles:</b> Se encuentra abocado al control de nuestras unidades, para garantizarle un viaje seguro, puntual y
                    confortable en todo su recorrido.
                  </Paragraph>
                </Col>
              </Row>
            </section>
          </Element>
          <Element name="oficina">
            <section id="oficina" style={{ padding: '50px 0' }}>
              <div className="container">
                <Title level={3}>NUESTRA OFICINA</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Title level={4}>ASOCIACIÓN DE TRANSPORTE MIXTO 16 DE JULIO "BANDERITAS VERDES" A.T.L.</Title>
                    <Paragraph>
                      SE ENCUENTRA FRENTE A LA PLAZA DE SAKAMARCA EN LA LOCALIDAD DE LLALLAGUA.
                      <br />
                      LA OFICINA CENTRAL ESTÁ DISPONIBLE DE 7:00 a.m. HASTA LAS 6:00 p.m. DE NO ESTAR DISPONIBLE, LLAMAR AL NÚMERO (+591)-71744232
                    </Paragraph>
                  </Col>
                </Row>
              </div>
            </section>
          </Element>
          <Element name="contact">
            <section id="contact" style={{ padding: '50px 0', textAlign: 'center' }}>
              <Title level={2}>NUESTRA UBICACION</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <iframe
                    className="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7570.556156766254!2d-66.58583737446621!3d-18.425679115192096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93fce077e998d65d%3A0x8ee49514fdd5508!2sMariscal+Santa+Cruz%2C+Llallagua!5e0!3m2!1ses!2sbo!4v1555311107150!5m2!1ses!2sbo"
                    allowFullScreen=""
                    loading="lazy"
                    style={{ width: '100%', height: '300px', border: '0' }}
                  ></iframe>
                </Col>
                <Col xs={24} md={12}>
                  <Button type="primary" href="https://web.whatsapp.com/" icon={<WhatsAppOutlined />}>
                    CONTACTAR
                  </Button>
                </Col>
              </Row>
            </section>
          </Element>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <div>
          <Button type="link" href="https://www.facebook.com/profile.php?id=100069092347175" icon={<FacebookOutlined />} />
          <Button type="link" href="https://twitter.com/" icon={<TwitterOutlined />} />
          <Button type="link" href="https://web.whatsapp.com/" icon={<WhatsAppOutlined />} />
        </div>
      </Footer>
    </Layout>
  );
};

export default Pagina;
