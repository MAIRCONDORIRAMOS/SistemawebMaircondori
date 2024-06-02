import React, { useState,useEffect  } from 'react';
import { Button, Input, DatePicker, Space, Select, Table, Badge, Card, notification , AutoComplete} from 'antd';
import { DollarOutlined, PrinterOutlined, LineChartOutlined, BarChartOutlined, AreaChartOutlined  } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Row, Col } from 'antd';
import axios from 'axios';
import { Modal } from 'antd';
import { renderToStream } from '@react-pdf/renderer';
import  ReportajePDF from './ReportajePDF';
import { Typography } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Reportaje = () => {
  const [license, setLicense] = useState('');
  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [placa, setPlaca] = useState('');
  const [parada, setParada] = useState('');
  const [grupo, setGrupo] = useState('');
  const [fecha, setFecha] = useState(null);
  const [mes, setMes] = useState('');
  const [costo, setCosto] = useState('');
  const [tableData, setTableData] = useState([]);
  const [licencias, setLicencias] = useState([]);
 const [borrarlicencia , setBorrarLicencia] = useState(false);
  const [idSocio, setIdSocio] = useState(null);
  const [idParada, setIdParada] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [selectedReportajeId, setSelectedReportajeId] = useState(-1);
  const [selectedLicencia, setSelectedLicencia] = useState(localStorage.getItem('selectedLicencia') || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchLicencia, setSearchLicencia] = useState('');
  
const [reportajeData, setReportajeData] = useState({ id: null });


const [nombremodal , setNombreModal]=useState('');
  const endpoint = 'https://back-end-plum.vercel.app/api'
  const handleRealizarPago = async () => {
    try {
      // Realizar la solicitud al servidor para crear el reportaje
      const response = await axios.post(`${endpoint}/reportaje`, {
        id_socio: idSocio,
        Fecha: fecha,
        Mes: mes,
        Costo: costo,
        id_parada: idParada
      });
  
      // Mostrar notificación de éxito
      notification.success({
        message: 'Reportaje creado con éxito',
      });
  
      // Limpiar los campos del formulario después de la creación exitosa del reportaje
      setFecha(null);
      setMes('');
      setCosto('');
      setCi('');
      setNombre('');
      setGrupo('');
      setPlaca('');
      setParada('');
      setLicense('');
      setSelectedLicencia(null);
      setIdSocio(null);
      setIdParada(null);
      fetchData(); // Mover la llamada aquí
   //   setBorrarLicencia(prevState => !prevState); 
     // alert(`El estado de borrarLicencia es: ${borrarlicencia}`);
    } catch (error) {
      console.error('Error al crear el reportaje:', error);
      // Mostrar notificación de error si la solicitud falla
      notification.error({
        message: 'Error al crear el reportaje',
        description: 'Por favor, inténtalo de nuevo más tarde.'
      });
    }
  };
  const openModal = () => {
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  const handlePrintTicket = async (reportajeId) => {

    setSelectedReportajeId(reportajeId);
    alert(`ID del reportaje: ${reportajeId}`);
  
    try {
      // Realizar una solicitud HTTP GET al backend para obtener la información del reportaje por su ID
      const response = await axios.get(`${endpoint}/reportaje/${reportajeId}`);
      
      // Mostrar la información del reportaje en un alert
      alert(JSON.stringify(response.data, null, 2));
      setReportajeData(response.data);
      openModal(); //
    } catch (error) {
      console.error('Error al obtener la información del reportaje:', error);
      // Mostrar notificación de error si la solicitud falla
      notification.error({
        message: 'Error al obtener la información del reportaje',
        description: 'Por favor, inténtalo de nuevo más tarde.'
      });
      console.log(error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' , width:'200' },
    { title: 'Fecha', dataIndex: 'Fecha', key: 'Fecha' ,width:'200'},
    { title: 'Mes', dataIndex: 'Mes', key: 'Mes',width:'200' },
    { title: 'Costo', dataIndex: 'Costo', key: 'Costo' ,width:'200'},
    { title: 'Nombre Socio', dataIndex: 'nombre_socio', key: 'nombre_socio',width:'200' },
    { title: 'Licencia', dataIndex: 'Licencia', key: 'Licencia', width: '200' },
  { title: 'Placa', dataIndex: 'Placa', key: 'Placa', width: '200' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record) => (
        <Button  onClick={() => handlePrintTicket(record.id)}>
          Habilitar Mes
        </Button>
      ),
      width: '100'
    }
  ];

  const fetchLicenciasSocios = async () => {
    try {
      const response = await axios.get(`${endpoint}/socios/licencias`);
      setLicencias(response.data);
    } catch (error) {
      console.error('Error al obtener las licencias de los socios:', error);
    }
  };
  const handleSelectLicencia = async (value) => {
    setSelectedLicencia(value);
    setLicense(value);
    try {
      const response = await axios.get(`${endpoint}/socios/licencias/${value}/parada-grupo`);
    const socioData = response.data;

    // Actualizar el estado con los datos recibidos
    setNombre(socioData.nombre_socio);
    setCi(socioData.CI);
    setPlaca(socioData.Placa);
    setParada(socioData.Nombre_parada);
    setGrupo(socioData.Nombre_grupo);
    setIdSocio(socioData.id_socio);
    setIdParada(socioData.id_parada);
 //     const socioDataJson = JSON.stringify(socioData.Placa, null, 2);

      // Mostrar los datos en un alert
      console.log(socioData);

    // Mostrar los datos en un alert directamente desde socioData
    alert(`id_socio: ${socioData.id_socio}\nNombre: ${socioData.nombre_socio}\nCI: ${socioData.CI}\nCelular: ${socioData.Celular}\nDirección: ${socioData.Direccion}\nLicencia: ${socioData.Licencia}\nPlaca: ${socioData.Placa}\nParada: ${socioData.Nombre_parada}\nGrupo: ${socioData.Nombre_grupo}\nId_parada: ${socioData.id_parada}`);
  
    } catch (error) {
      console.error('Error al obtener los datos del socio:', error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${endpoint}/reportajes/socios`);
      setTableData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  
  useEffect(() => {
    fetchLicenciasSocios();
    fetchData();
 
  }, []);
  const handlePrint = () => {
   
  };

  const handleYesClick = async () => {

   // alert(`ID del reportaje: ${selectedReportajeId}`);
   try {
      // Realizar la inserción en la base de datos
      const response = await axios.post(`${endpoint}/hoja-de-ruta`, {
        id_reportaje: selectedReportajeId,
        fecha_marcacion: '' // Dejar la fecha de marcación en blanco
      });

      
      notification.success({
        message: 'Hoja de ruta habilitada exitosamente',
      });
      setModalVisible(false);
    } catch (error) {
      console.error('Error al crear la hoja de ruta:', error);
      // Mostrar notificación de error si la solicitud falla
      notification.error({
        message: 'Error al habilitar  la hoja de ruta',
        description: 'Por favor, inténtalo de nuevo más tarde.'
      });
    }
  };
  const filteredData = tableData.filter(item => item.Licencia.includes(searchLicencia));
  return (
    <div>
      <Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
    <AutoComplete
      value={license}
      style={{ width: '100%' }}
      options={licencias.map(licencia => ({ value: licencia }))}
      placeholder="Licencia"
      filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
      onSelect={handleSelectLicencia}
      allowClear={borrarlicencia}
    />
  </Col>
  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
    <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
  </Col>
  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
    <Input placeholder="CI" value={ci} onChange={(e) => setCi(e.target.value)} />
  </Col>
  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
    <Input placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
  </Col>
  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
    <Input placeholder="Parada" value={parada} onChange={(e) => setParada(e.target.value)} />
  </Col>
  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
    <Input placeholder="Grupo" value={grupo} onChange={(e) => setGrupo(e.target.value)} />
  </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <DatePicker placeholder="Fecha" value={fecha} onChange={(date) => setFecha(date)} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Input placeholder="Mes" value={mes} onChange={(e) => setMes(e.target.value)} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Input placeholder="Costo" value={costo} onChange={(e) => setCosto(e.target.value)} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
        <Button type="primary" icon={<DollarOutlined />} onClick={handleRealizarPago}>
          Realizar pago
        </Button>
        </Col>
        <Input placeholder="Buscar por Licencia" value={searchLicencia} onChange={(e) => setSearchLicencia(e.target.value)} />

   </Row>
  

  
   <Table
   dataSource={filteredData}
   columns={columns}
   pagination={false}
   scroll={{ y: 300, x: 'auto' }}
   rowKey="id"
   onRow={(record) => ({
     onClick: () => {
       setSelectedReportajeId(record.id); // Actualizamos con el ID del registro seleccionado
     },
   })}
/>
      <Modal
  title= {<Title level={3}>Desea Habilitar el Mes de  {reportajeData.Mes}  a : </Title>}
  visible={modalVisible}
  onCancel={closeModal}
  footer={[
    <Button key="pagar" type="primary" onClick={handleYesClick}>Si</Button>,
    <Button key="cerrar" onClick={closeModal}>Cerrar</Button>
  ]}
>
  <div>
    <p>Nombre Socio : {reportajeData.nombre_socio}</p>
    <p>Licencia : {reportajeData.Licencia}</p>
    <p>Placa : {reportajeData.Placa}</p>
    <p>Parada : {reportajeData.Nombre_parada}</p> 
  </div>
  
</Modal>
  </div>
  );
};

export default Reportaje;
