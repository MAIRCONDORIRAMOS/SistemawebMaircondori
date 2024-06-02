import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Dropdown, Menu, Modal, Drawer, Form, Row, Col, Select, Checkbox, Tabs, Avatar, List, Tooltip, message, Skeleton } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined, CarOutlined, SyncOutlined, UserSwitchOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Item } = Menu;
const { Option } = Select;
const useForceUpdate = () => {
  const [, setValue] = useState(0); // Estado dummy
  return () => setValue(value => value + 1); // Función que actualiza el estado dummy
};

const endpoint = 'https://back-end-plum.vercel.app/api'
const SociosChoferes = () => {

  const forceUpdate = useForceUpdate();
  const [sociosDrawerVisible, setSociosDrawerVisible] = useState(false);
  const [choferesDrawerVisible, setChoferesDrawerVisible] = useState(false);
  const [groupDisabled, setGroupDisabled] = useState(true); // Estado para controlar si el campo Grupo está deshabilitado
  const [socios, setSocios] = useState([]);
  const [choferes, setChofer] = useState([]);
  const showSociosDrawer = () => {
    setSociosDrawerVisible(true);
  };

  const showChoferesDrawer = () => {

    setChoferesDrawerVisible(true);
  };

  const onCloseSociosDrawer = () => {

    setNombre('');
    setCi('');
    setCelular('');
    setDireccion('');
    setLicencia('');
    setPlaca('');
    setGrupoId('');
    setUpdateMode(false);
    setSociosDrawerVisible(false);
  };

  const onCloseChoferesDrawer = () => {
    setSocioSeleccionadoId('');
    setNombreChofer('');
    setCiChofer('');
    setCelularChofer('');
    setLicenciaChofer('');
    setSocioSeleccionadoId('');
    setChoferPlaca('');
    setUpdateMode(false);
    setChoferesDrawerVisible(false);
  };


  const handleUseExtensionChange = (e) => {
    setGroupDisabled(!e.target.checked);
  };
  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [mos, setMos] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [licencia, setLicencia] = useState('');
  const [placa, setPlaca] = useState('');
  const [grupoId, setGrupoId] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socioSeleccionado, setSocioSeleccionado] = useState('');
  const [nombrechofer, setNombreChofer] = useState('');
  const [cichofer, setCiChofer] = useState('');
  const [celularchofer, setCelularChofer] = useState('');
  const [licenciachofer, setLicenciaChofer] = useState('');
  const [choferplaca, setChoferPlaca] = useState('');
  const [socioSeleccionadoId, setSocioSeleccionadoId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entityId, setEntityId] = useState(null); // Estado para almacenar el ID de la entidad a eliminar
  const [entityType, setEntityType] = useState('');
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [socioPlacas, setSocioPlacas] = useState([]);
  const [placaSeleccionada, setPlacaSeleccionada] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetchGrupos();
    loadSociosData();
    loadChoferData();
    if (socioSeleccionadoId) {
      cargarPlacasAsociadas(socioSeleccionadoId);
    }
  }, [socioSeleccionadoId]);
  const loadSociosData = async () => {
    try {
      const response = await axios.get(`${endpoint}/socios`);
      setSocios(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching socios:', error);
      // Mostrar mensaje de error si falla la solicitud
      message.error('Error al obtener los datos de los socios');
      setLoading(false);
    }
  };
  const loadChoferData = async () => {
    try {
      const response = await axios.get(`${endpoint}/choferes`);
      setChofer(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching socios:', error);
      // Mostrar mensaje de error si falla la solicitud
      message.error('Error al obtener los datos de los socios');
      setLoading(false);
    }
  };

  const fetchGrupos = async () => {
    try {
      const response = await axios.get(`${endpoint}/grupos`);
      setGrupos(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };


  const onFinishSocio = async (e) => {
    try {
      if (updateMode) {
        // Lógica para la actualización del socio
        await axios.put(`${endpoint}/socio/${selectedData.id}`, {
          Nombre: nombre,
          CI: ci,
          Celular: celular,
          Direccion: direccion,
          Licencia: licencia,
          Placa: placa,
          id_grupo: grupoId
        });
        message.success('Datos del socio actualizados exitosamente');
      } else {
        // Lógica para la creación de un nuevo socio
        await axios.post(`${endpoint}/socio`, {
          Nombre: nombre,
          CI: ci,
          Celular: celular,
          Direccion: direccion,
          Licencia: licencia,
          Placa: placa,
          id_grupo: grupoId
        });
        message.success('Socio creado exitosamente');
      }
      // Limpiar los campos después de enviar la solicitud
      setNombre('');
      setCi('');
      setCelular('');
      setDireccion('');
      setLicencia('');
      setPlaca('');
      setGrupoId('');
      resetUpdateMode();
      setSociosDrawerVisible(false);
      setUpdateMode(false);
      loadSociosData();
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al guardar los datos del socio');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUpdateMode(false);
  };

  const onFinishChofer = async () => {
    try {
      if (updateMode) {

        await axios.put(`${endpoint}/chofer/${selectedData.id}`, {
          id_socio: socioSeleccionadoId,
          Nombre_completo: nombrechofer,
          CI: cichofer,
          Celular: celularchofer,
          Licencia: licenciachofer,
          Placa: choferplaca
        });
        message.success('Datos del chofer actualizados exitosamente');
      } else {

        await axios.post(`${endpoint}/chofer`, {
          id_socio: socioSeleccionadoId,
          Nombre_completo: nombrechofer,
          CI: cichofer,
          Celular: celularchofer,
          Licencia: licenciachofer
        });
        message.success('Chofer creado exitosamente');
     
      }

      setSocioSeleccionadoId('');
    setNombreChofer('');
    setCiChofer('');
    setCelularChofer('');
    setLicenciaChofer('');
    setSocioSeleccionadoId('');
    setChoferPlaca('');
      setChoferesDrawerVisible(false);
      setUpdateMode(false);
      loadChoferData();
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al guardar los datos del chofer');
    }
  };

  //modal eliminar 
  const handleDeleteClick = (entityType, entityId) => {
    setEntityId(entityId);
    setEntityType(entityType);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${endpoint}/${entityType}/${entityId}`);
      message.success(`${entityType === 'socio' ? 'Socio' : 'Chofer'} eliminado exitosamente`);
      if (entityType === 'socio') {
        loadSociosData();
      } else if (entityType === 'chofer') {
        loadChoferData();
      }
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      message.error(`Error al eliminar el ${entityType}`);
    } finally {
      setShowDeleteModal(false);
    }
  };
  const resetUpdateMode = () => {
    setUpdateMode(false);
  };
  const handleUpdateSocioClick = (socio) => {

    setSelectedData(socio); // Almacenar los datos del socio seleccionado
    setNombre(socio.Nombre);
    setCi(socio.CI);
    setCelular(socio.Celular);
    setDireccion(socio.Direccion);
    setLicencia(socio.Licencia);
    setPlaca(socio.Placa);
    setGrupoId(socio.id_grupo);
    //alert(socio.CI);
    setSociosDrawerVisible(true);
    setUpdateMode(true);
    forceUpdate();

  };
  const handleUpdateChoferClick = (chofer) => {

    setSelectedData(chofer); 
    setSocioSeleccionadoId(chofer.id_socio);
    setNombreChofer(chofer.Nombre_completo);
    setCiChofer(chofer.CI);
    setCelularChofer(chofer.Celular);
    setLicenciaChofer(chofer.Licencia);
    setSocioSeleccionadoId(chofer.id_socio)
    setChoferPlaca(chofer.Placa)
    setChoferesDrawerVisible(true);
   // alert(JSON.stringify(chofer, null, 2));
    setUpdateMode(true);
    forceUpdate();



  };
  const handleSocioSeleccionadoChange = async (value) => {

    setSocioSeleccionadoId(value);
    await cargarPlacasAsociadas(value);
  };


  const cargarPlacasAsociadas = async (socioId) => {
    try {
      setChoferPlaca('');
      const response = await axios.get(`${endpoint}/socio/${socioId}/placas`);
      const placas = response.data;
      setSocioPlacas(placas.map(placa => placa.Placa));
      setSocioPlacas(placas.map(placa => placa.Placa));


      if (placas.length > 0) {
        setPlacaSeleccionada(placas[0].Placa);
      }
    } catch (error) {
      console.error('Error al cargar las placas asociadas:', error);

    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredSocios = socios.filter((socio) =>
    socio.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredChoferes = choferes.filter((chofer) =>
    chofer.Nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Space wrap="wrap" gap="large" direction="vertical" style={{ width: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <Dropdown
          overlay={<Menu><Item key="1" icon={<UserOutlined />} onClick={showSociosDrawer}>Agregar Socio</Item><Item key="2" icon={<CarOutlined />} onClick={showChoferesDrawer}>Agregar Chofer</Item></Menu>}
          placement="bottomRight"
        >
          <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: '10px' }}>Agregar Nuevo</Button>
        </Dropdown>
        <Input placeholder="Buscar"
onChange={handleSearchChange}
          prefix={<SearchOutlined />} style={{ width: '200px' }} />

      </div>
      <Drawer
        title={updateMode ? "Actualizar Datos de Socio" : "Agregar Socio"}
        width={720}
        onClose={onCloseSociosDrawer}
        visible={sociosDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        forceRender={true}
        footer={<Space><Button onClick={onCloseSociosDrawer}>Cancelar</Button> <Button type="primary" onClick={updateMode ? handleUpdateSocioClick : onFinishSocio}>
        {updateMode ? "Actualizar" : "Guardar"}
      </Button></Space>}
      >
        <Form layout="vertical" onFinish={onFinishSocio} onSubmit={onFinishSocio}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
                <div>
                  <Input

                    placeholder="Nombre"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)} />
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>

              <Form.Item name="ci" label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>CI</span>

                </div>
              } rules={[{ required: true, message: 'Por favor ingresa el CI' }]}>
                <div>
                  <Input
                    placeholder="Número" style={{ width: 'calc(100% - 100px)' }}
                    value={ci}
                    onChange={e => setCi(e.target.value)} />
                </div>
              </Form.Item>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cellphone" label="Celular" rules={[{ required: true, message: 'Por favor ingresa el celular' }]}>
                <div>
                  <Input

                    placeholder="Celular" type="number"
                    value={celular}
                    onChange={e => setCelular(e.target.value)} />
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="address" label="Dirección" rules={[{ required: true, message: 'Por favor ingresa la dirección' }]}>
                <div>
                  <Input
                    placeholder="Dirección"
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)} />
                </div>
              </Form.Item>

            </Col>

          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="license" label="Licencia" rules={[{ required: true, message: 'Por favor ingresa la licencia' }]}>
                <div>
                  <Input

                    placeholder="Licencia" type="number"
                    value={licencia}
                    onChange={e => setLicencia(e.target.value)} />
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="plate" label="Placa" rules={[{ required: true, message: 'Por favor ingresa la placa' }]}>
                <div>
                  <Input

                    placeholder="Placa" maxLength={9}
                    value={placa}
                    onChange={e => setPlaca(e.target.value)} />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="group" label="Grupo">
                <div>
                  <Select

                    style={{ width: 200, marginBottom: 10 }}
                    placeholder="Seleccione un grupo"
                    value={grupoId}
                    onChange={value => setGrupoId(value)}
                  >
                    {grupos.map(grupo => (
                      <Option key={grupo.id} value={grupo.id}>
                        {grupo.Nombre_grupo}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Drawer
         title={updateMode ? "Actualizar Datos de Chofer" : "Agregar Chofer"}
        width={720}
        onClose={onCloseChoferesDrawer}
        visible={choferesDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={<Space><Button onClick={onCloseChoferesDrawer}>Cancelar</Button><Button type="primary" onClick={updateMode ? handleUpdateChoferClick : onFinishSocio}>
        {updateMode ? "Actualizar" : "Guardar"}
      </Button></Space>}
      >
        <Form layout="vertical" onFinish={onFinishChofer}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="socio" label="Socio" rules={[{ required: true, message: 'Por favor selecciona el socio' }]}>
                <div >
                <Select
                  placeholder="Selecciona el socio"
                  value={socioSeleccionadoId}
                  onChange={handleSocioSeleccionadoChange} // Llama a la función cuando cambia la selección
                >
                  {socios.map((socio) => (
                    <Option key={socio.id} value={socio.id}>
                      {socio.Nombre}
                    </Option>
                  ))}
                </Select>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
                <div>
                <Input placeholder="Nombre"
                  value={nombrechofer}
                  onChange={e => setNombreChofer(e.target.value)} />
              </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item name="ci" label="CI" rules={[{ required: true, message: 'Por favor ingresa el CI' }]}>
              <div>
                <Input placeholder="CI"
                  value={cichofer}
                  onChange={e => setCiChofer(e.target.value)}
                />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cellphone" label="Celular" rules={[{ required: true, message: 'Por favor ingresa el celular' }]}>
              <div>
                <Input placeholder="Celular" type="number"
                  value={celularchofer}
                  onChange={e => setCelularChofer(e.target.value)}
                />
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="license" label="Licencia" rules={[{ required: true, message: 'Por favor ingresa la licencia' }]}>
              <div>
                <Input placeholder="Licencia"
                  value={licenciachofer}
                  onChange={e => setLicenciaChofer(e.target.value)} />
              </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="plate" label="Placa" rules={[{ required: true, message: 'Por favor selecciona la placa' }]}>
              <div>
                <Select placeholder="Selecciona la placa"
                  value={placaSeleccionada}
                  onChange={setPlacaSeleccionada}>
                  {socioPlacas.map((placa, index) => (
                    <Option key={index} value={placa}>
                      {placa}
                    </Option>
                  ))}
                </Select>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="group" label="Grupo">
                <Input placeholder="Grupo" disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Modal
        title="Confirmar Eliminación"
        visible={showDeleteModal}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      >
        <p>¿Estás seguro de que quieres eliminar este socio?</p>
      </Modal>
      <Tabs defaultActiveKey="1" size='large' style={{ marginBottom: 32 }}>
        <Tabs.TabPane tab="Socios" key="1">
          <div style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', width: '100%' }}> {/* Ajusta el ancho para que ocupe el 100% de la página */}
            {loading ? (
              <Skeleton active />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={filteredSocios}// Usar los datos cargados en lugar de data
                renderItem={(socio, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                      title={<a >{socio.Nombre}</a>}
                      description={socio.title}
                    />
                    <div>
                      <Tooltip title="Actualizar Datos">
                        <Button type="primary" shape="circle" icon={<SyncOutlined />} style={{ marginRight: 8, backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={() => handleUpdateSocioClick(socio)}></Button>
                      </Tooltip>
                    
                      <Tooltip title="Eliminar Usuario">
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />} style={{ backgroundColor: '#ff4d4f', color: '#fff', borderColor: '#ff4d4f' }} />
                      </Tooltip>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Choferes" key="2">
          {loading ? (
            <Skeleton active />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filteredChoferes} // Usar los datos cargados en lugar de data
              renderItem={(chofer, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                    title={<a >{chofer.Nombre_completo}</a>}
                    description={chofer.title}
                  />
                  <div>
                    <Tooltip title="Actualizar Datos">
                      <Button type="primary" shape="circle" icon={<SyncOutlined />} style={{ marginRight: 8, backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={() => handleUpdateChoferClick(chofer)}></Button>
                    </Tooltip>
                  
                    <Tooltip title="Eliminar Usuario">
                      <Button type="danger" shape="circle" icon={<DeleteOutlined />} style={{ backgroundColor: '#ff4d4f', color: '#fff', borderColor: '#ff4d4f' }} onClick={() => handleDeleteClick('chofer', chofer.id)} />
                    </Tooltip>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Tabs.TabPane>
      </Tabs>
    </Space>
  );
};

export default SociosChoferes;