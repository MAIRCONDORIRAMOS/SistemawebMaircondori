import React, { useState ,useEffect } from 'react';
import {Tabs , Button, Modal, Input, Select, Table, Tooltip, message, Row, Col  ,Flex ,Space} from 'antd';
import { PlusOutlined, UserOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Option } = Select;
const { TabPane } = Tabs;
const Usuarios = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('Usuario');
  const [userData, setUserData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [socios, setSocios] = useState([]);
  const [choferes, setChoferes] = useState([]); 
  const [originalUserData, setOriginalUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedIdField, setSelectedIdField] = useState('');
  const [userTypeLabel, setUserTypeLabel] = useState('');
  const [selectedUserCategory, setSelectedUserCategory] = useState('Socios');
  const endpoint = 'https://back-end-plum.vercel.app/api'
  const handleSelectUserType = (value) => {
    setSelectedUserType(value);
    if (value === 'Administrador') {
      setAdminModalVisible(true);
    } else {
      setAdminModalVisible(false);
    }
  };
  const handleUserCategoryChange = (value) => {
   
    setSelectedUserCategory(value);
   
    // Filtrar los datos de usuario según la categoría seleccionada
    let filteredData = [];
    if (value === 'Socios') {
      filteredData = originalUserData.filter(user => user.Nombre_socio);
    } else if (value === 'Choferes') {
      filteredData = originalUserData.filter(user => user.Nombre_chofer);
    }
    setUserData(filteredData);
  };
  
  useEffect(() => {
    fetchSocios();
    fetchChoferes(); 
    fetchUsuarios();
    handleUserCategoryChange( selectedUserCategory); 
   
  }, []);
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${endpoint}/usuarios`); // Llama al endpoint para obtener los usuarios
      
      setUserData(response.data);
      setOriginalUserData(response.data); // Almacena los datos originales // Almacena los datos de los usuarios en el estado
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      message.error('Error al obtener los datos de los usuarios');
    }
  };
  const fetchSocios = async () => {
    try {
      const response = await axios.get(`${endpoint}/socios`);
      setSocios(response.data);
    } catch (error) {
      console.error('Error fetching socios:', error);
      // Mostrar mensaje de error si falla la solicitud
      message.error('Error al obtener los datos de los socios');
    }
  };
  const fetchChoferes = async () => {
    try {
      const response = await axios.get(`${endpoint}/choferes`); // Llama al endpoint para obtener los choferes
      setChoferes(response.data); // Almacena los datos de los choferes en el estado
    } catch (error) {
      console.error('Error fetching choferes:', error);
      message.error('Error al obtener los datos de los choferes');
    }
  };
 
  
  
  const handlePrintUserData = () => {
    // Aquí iría la lógica para imprimir los datos del usuario
    message.success('Datos de registro impresos correctamente');
  };

  const handleModifyUserData = () => {
    // Aquí iría la lógica para modificar los datos del usuario
    message.success('Datos de usuario modificados correctamente');
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // Aquí iría la lógica para buscar usuarios
  };
  const columnsModalSocios = [
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
      fixed: 'left',
      width: '20%', // Ancho relativo del 20%
      minWidth: '100px', // Ancho mínimo de 100px
      maxWidth: '300px', // Ancho máximo de 300px
    },
    {
      title: 'CI',
      dataIndex: 'CI',
      key: 'CI',
    },
    {
      title: 'Celular',
      dataIndex: 'Celular',
      key: 'Celular',
    },
    {
      title: 'Dirección',
      dataIndex: 'Direccion',
      key: 'Direccion',
    },
    {
      title: 'Licencia',
      dataIndex: 'Licencia',
      key: 'Licencia',
    },
    {
      title: 'Placa',
      dataIndex: 'Placa',
      key: 'Placa',
    },
   
    {
      fixed: 'right',
      title: 'Acciones',
      key: 'action', width: 90,
      render: (_, record) => (
        <Button onClick={() => handleSelectUser(record)}>Seleccionar</Button>
      ),
    
    },
    
  ];

  const columnsModalCohoferes = [
    {
      title: 'Nombre',
      dataIndex: 'Nombre_completo',
      key: 'Nombre_completo',
    },
    {
      title: 'CI',
      dataIndex: 'CI',
      key: 'CI',
    },
    {
      title: 'Licencia',
      dataIndex: 'Licencia',
      key: 'Licencia',
    },
    {
      title: 'Placa',
      dataIndex: 'Placa',
      key: 'Placa',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleSelectUser(record)}>Seleccionar</Button>
      ),
    },
  ];
  const userColumns = {
    Socios: [
      {
        title: 'Nombre de Usuario',
        dataIndex: 'Nombre_usuario',
        key: 'Nombre_usuario',
      },
      {
        title: 'Contraseña',
        dataIndex: 'Contraseña',
        key: 'Contraseña',
      },
      {
        title: 'Rol',
        dataIndex: 'Rol',
        key: 'Rol',
      },
      {
        title: 'Nombre de Socio',
        dataIndex: 'Nombre_socio',
        key: 'Nombre_socio',
      },
      {
        title: 'CI de Socio',
        dataIndex: 'CI_socio',
        key: 'CI_socio',
      },
      {
        title: 'Celular de Socio',
        dataIndex: 'Celular_socio',
        key: 'Celular_socio',
      },
      {
        title: 'Dirección de Socio',
        dataIndex: 'Direccion_socio',
        key: 'Direccion_socio',
      },
      {
        title: 'Licencia de Socio',
        dataIndex: 'Licencia_socio',
        key: 'Licencia_socio',
      },
      
    ],
    Choferes: [
      {
        title: 'Nombre de Usuario',
        dataIndex: 'Nombre_usuario',
        key: 'Nombre_usuario',
      },
      {
        title: 'Contraseña',
        dataIndex: 'Contraseña',
        key: 'Contraseña',
      },
      {
        title: 'Rol',
        dataIndex: 'Rol',
        key: 'Rol',
      },
      {
        title: 'Nombre de Chofer',
        dataIndex: 'Nombre_chofer',
        key: 'Nombre_chofer',
      },
      {
        title: 'CI de Chofer',
        dataIndex: 'CI_chofer',
        key: 'CI_chofer',
      },
      {
        title: 'Celular de Chofer',
        dataIndex: 'Celular_chofer',
        key: 'Celular_chofer',
      },
      {
        title: 'Licencia de Chofer',
        dataIndex: 'Licencia_chofer',
        key: 'Licencia_chofer',
      },
      {
        title: 'Placa de Chofer',
        dataIndex: 'Placa_chofer',
        key: 'Placa_chofer',
      },
      {
        fixed: 'right',
        title: 'Acciones',
        key: 'actions',
        render: (text, record) => (
          <div>
            <Tooltip title="Imprimir Datos">
              <Button icon={<PrinterOutlined />} onClick={() => handlePrintUserData(record)} />
            </Tooltip>
            <Tooltip title="Editar Datos">
              <Button icon={<EditOutlined />} onClick={() => handleModifyUserData(record)} />
            </Tooltip>
          </div>
        ),
      },
    ],
  };
  const columnsModal = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CI',
      dataIndex: 'ci',
      key: 'ci',
    },
    {
      title: 'Licencia',
      dataIndex: 'license',
      key: 'license',
    },
    {
      title: 'Placa',
      dataIndex: 'plate',
      key: 'plate',
    },
    {
     
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Doe',
      ci: '1234567',
      license: 'ABC123',
      plate: 'XYZ123',
    },
    // Más datos ficticios aquí...
  ];

  const handleSelectUser = (record, userType) => {
    let name;
    let userId; // Variable para almacenar el ID del usuario seleccionado
   
    if (userType === "Socios") {
     
      name = record.Nombre;
      userId = record.id; 
      setSelectedUserId(userId); 
      setUserTypeLabel("Socios");
    } else if (userType === "Cohoferes") {
     
      name = record.Nombre_completo;
      userId = record.id; 
      setSelectedUserId(userId); 
      setUserTypeLabel("Choferes");
    }
    
   // alert(`ID del usuario seleccionado : tipo :  . ${userTypeLabel} ${name} ${userId} `);
    // Mostrar el ID del usuario seleccionado
    
   
   
    const { CI, Licencia, Placa } = record;
    setSelectedUserData({ name: name, ci: CI, license: Licencia, plate: Placa });
    setModalVisible(false);
  };
 
  

// Función para manejar el cambio de categoría de usuario

const handleShowUserId = () => {
  if (selectedUserId !== null) {
    alert(`ID del usuario seleccionado: ${userTypeLabel} ${selectedUserId}`);
  } else {
    alert('No se ha seleccionado ningún usuario');
  }
};
const handleAddUser = async () => {
  if (!selectedUserData) {
    message.error('Por favor selecciona un usuario');
    return;
  }

  if (username && password) {
    try {
      let idField;
      let cont=(userTypeLabel);
      if (cont === 'Socios') {
        idField = "id_socio";
      //  alert(`entro en socio`);
      } else if (cont === 'Choferes') {
        idField = "id_chofer";
       // alert(`entro en chofer`);
      }
     // alert(`ID del usuario seleccionado :${cont} ${idField} ${selectedUserId}`);
      const response = await axios.post(`${endpoint}/usuario`, {
        Nombre_usuario: username,
        Contraseña: password,
        Rol: selectedUserType,
        [idField]: selectedUserId,
      });
      setUsername('');
      setPassword('');
      setSelectedUserType('Usuario');
      setSelectedUserId(null);
      setSelectedUserData(null);

      // Actualizar la tabla automáticamente
      fetchUsuarios();
      setUserData([...userData, response.data]);
      message.success('Usuario agregado correctamente');
      setModalVisible(false);
   //   setSelectedIdField(idField);
    
    } catch (error) {
      console.error('Error adding user:', error);
      message.error('Error al agregar el usuario');
    }
  } else {
    message.error('Por favor completa todos los campos');
  }
};
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <><Flex wrap gap="small">
        <Row gutter={[16, 16]}>
          <Col>
            <Button icon={<UserOutlined />} onClick={() => setModalVisible(true)}>
              Seleccionar
            </Button>
          </Col>
        </Row>

        <Modal
          title="Seleccionar Usuario"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800} // Ancho personalizado del modal
        >
          <Table
            dataSource={data}
            columns={columnsModal}
            pagination={false}
            scroll={{ x: 'max-content' }} // Agrega un scroll horizontal si la tabla supera el ancho del modal
          />
        </Modal>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input placeholder="Nombre" value={selectedUserData?.name || ''} disabled />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input placeholder="CI" value={selectedUserData?.ci || ''} disabled />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input placeholder="Licencia" value={selectedUserData?.license || ''} disabled />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input placeholder="Placa" value={selectedUserData?.plate || ''} disabled />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input.Password
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select value={selectedUserType} onChange={handleSelectUserType}>
              <Option value="Usuario">Usuario</Option>
              <Option value="Administrador">Administrador</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
              Agregar
            </Button>
          </Col>
        </Row>
        <Modal
        title="Seleccionar Usuario"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800} // Ancho personalizado del modal
      >
       
        <Tabs defaultActiveKey="1">
          <TabPane tab="Socios" key="1">
            <Table
            dataSource={socios} 
            columns={columnsModalSocios }
            size="small"
             pagination={{ pageSize: 5 }} // Paginación con 5 datos por página
             scroll={{ y: 400 }}
             onRow={(record) => ({
              onClick: () => handleSelectUser(record, "Socios"), // Pasar "Socios" como tipo de usuario
            })}
            />
          </TabPane>
          <TabPane tab="Cohoferes" key="2">
            <Table
              dataSource={choferes} 
              columns={columnsModalCohoferes}
              size="small"
              pagination={{ pageSize: 4}} 
              scroll={{ y: 300 }}
              onRow={(record) => ({
                onClick: () => handleSelectUser(record, "Cohoferes"), // Pasar "Cohoferes" como tipo de usuario
              })}
            
            />
          </TabPane>
        </Tabs>
      </Modal>
      <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
            <Input.Search
              placeholder="Buscar"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        </Flex>
        <Row gutter={[16, 16]}>
        <Select value={selectedUserCategory} onChange={handleUserCategoryChange} style={{ marginBottom: '16px' }}>
  <Option value="Socios" >Mostrar Usuarios Socios</Option>
  <Option value="Choferes">Mostrar Usuarios Choferes</Option>
</Select>
</Row> 
        <Table
          dataSource={userData} // Aquí iría el estado que contiene los datos filtrados
          columns={userColumns[selectedUserCategory]}
          pagination={{ pageSize: 4}} 
          size="small"
          scroll={{ y: 300 }}// Agrega un scroll horizontal si la tabla supera el ancho del contenedor
        />
       
         
      </>
      
      </Space>
);
};
export default Usuarios;
