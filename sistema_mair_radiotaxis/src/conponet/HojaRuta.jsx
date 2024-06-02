import React, { useState,useEffect } from 'react';
import { Card, Calendar, Alert, Row, Col, Button, Modal } from 'antd';
import { motion } from 'framer-motion';
import { CalendarOutlined, TeamOutlined, CarOutlined, CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import 'dayjs/locale/es';

const endpoint = 'https://back-end-plum.vercel.app/api'
const { Meta } = Card;
dayjs.locale('es');
const HojaRuta = ({placa}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hojasDeRutaData, setHojasDeRutaData] = useState(null);
  const [mes,setMes]=useState('');
  const [grupo , setGrupo]=useState('');
  const [ruta , setRuta]=useState('');
  const [idReportaje , setIdReportaje]=useState('');
  const [fechas, setFechas]=useState('');
  const [fechasmarcadas, setFechasMarcadas] = useState('');
  const locale = {
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy',
  };
  useEffect(() => {
   // alert(`placa: ${placa}`);
    handleShowData();
   
  }, []);
  useEffect(() => {
    if (idReportaje) {
      getFechasMarcacion();
    }
  }, [idReportaje]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleButtonClick = async () => {
    getFechasMarcacion();
    if (selectedDate) {
      try {
        const fechasConcatenadas = fechas ? `${fechas},${selectedDate.format('YYYY-MM-DD')}` : selectedDate.format('YYYY-MM-DD');
        alert(`Reportaje Mes: ${fechasConcatenadas}`);
        await axios.put(`${endpoint}/hoja-de-ruta/${idReportaje}`, { fecha_marcacion: fechasConcatenadas});
        getFechasMarcacion();
        // Mostrar una alerta o mensaje de éxito
        Modal.success({
          title: 'Fecha de marcación actualizada',
          content: 'La fecha de marcación ha sido actualizada exitosamente.',
        });
      } catch (error) {
        // Manejar errores si la solicitud falla
        console.error('Error al actualizar la fecha de marcación:', error);
        Modal.error({
          title: 'Error al actualizar la fecha de marcación',
          content: 'Hubo un error al intentar actualizar la fecha de marcación. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    }
  };
  const getFechasMarcacion = async () => {
    try {
      const response = await axios.get(`${endpoint}/hoja-de-ruta/${idReportaje}`);
      setFechas(response.data.Fecha_marcacion);
      setFechasMarcadas(response.data.Fecha_marcacion.split(','));
     //alert(fechasmarcadas);
    } catch (error) {
      console.error('Error al obtener las fechas de marcación:', error);
    }
  };
  const handleShowData = async () => {
  
    try {
      const response = await axios.get(`${endpoint}/hoja-de-ruta/por-placa/${placa}`);
      setMes(response.data.reportaje_mes);
      setGrupo(response.data.grupo_nombre);
      setRuta(response.data.parada_nombre);
      setIdReportaje(response.data.hoja_id);
      //alert(`Reportaje Mes: ${response.data.reportaje_mes}`);
     // alert(`Reportaje Mes: ${response.data.grupo_nombre}`);
     // alert(`Reportaje Mes: ${response.data.parada_nombre}`);
     // alert(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error al obtener las hojas de ruta:', error);
    }
  };
  /*const generateRandomDates = () => {
    const currentDate = dayjs();
    const currentMonthDays = currentDate.daysInMonth();
    const randomDates = [];
    for (let i = 0; i < 5; i++) {
      const randomDay = Math.floor(Math.random() * currentMonthDays) + 1; // 1 - último día del mes
      const randomDate = currentDate.date(randomDay); // Establecer el día aleatorio en la fecha actual
      randomDates.push(randomDate.format('YYYY-MM-DD'));
    }
    setFechas(randomDates);
  };*/
  const dateCellRender = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    // Si la fecha actual está incluida en las fechas marcadas, devuelve un componente personalizado
    if (fechasmarcadas.includes(dateString)) {
      return <div style={{ backgroundColor: 'green', borderRadius: '5px', padding: '2px', margin: '1px', width: '100%', height: '100%' }} />;
    }
    return null;
  };
  const mesActual = dayjs().locale('es').format('MMMM').toUpperCase(); // Obtener el mes actual en español y mayúsculas
  const mesCard = mes; // Convertir el número del mes a nombre del mes y mayúsculas
  const esMesHabilitado = mesCard === mesActual; //
  return (
  
    <Row gutter={16} justify="center" style={{ padding: '20px' }}>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
      <p>Codigo de Registro : {idReportaje}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={{ width: 150 }}
          >
            <Card
              hoverable
              style={{ width: 150, backgroundColor: '#FFB6C1' }}
              cover={<CalendarOutlined style={{ fontSize: '36px', textAlign: 'center' }} />}
            >
              
              <Meta title={`Mes: ${mes}`}   style={{ textAlign: 'center', fontSize: '16px', marginTop: '10px' }} />
            
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={{ width: 150 }}
          >
            <Card
              hoverable
              style={{  backgroundColor: '#ADD8E6' }}
              cover={<TeamOutlined style={{ fontSize: '36px', textAlign: 'center' }} />}
            >
              <Meta title={`Grupo:`} 
              />
              <p  style={{ textAlign: 'center', fontSize: '16px', marginTop: '10px' }}>{grupo}</p>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={{ width: 150 }}
          >
            <Card
              hoverable
              style={{  backgroundColor: '#FFD700' }}
              cover={<CarOutlined style={{ fontSize: '36px', textAlign: 'center' }} />}
            >
              <Meta title={`Ruta: ${ruta}`} />
            </Card>
          </motion.div>
          <Button
            type="primary"
            danger
            style={{ marginTop: '10px' }}
            onClick={handleButtonClick}
            disabled={!selectedDate || !esMesHabilitado}
            icon={<CheckOutlined />}
          >
            Marcar Reportaje
          </Button>
        </div>
        {!esMesHabilitado && (
          <Alert
            message="Mes no Habilitado "
            type="error"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <div style={{ maxWidth: '800px', maxHeight: 'calc(100vh - 100px)', overflow: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
        <Calendar locale={locale} onSelect={handleSelectDate} fullscreen={false} dateCellRender={dateCellRender} />
        </div>
        {selectedDate && (
          <Alert message={`Fecha seleccionada: ${selectedDate.format('YYYY-MM-DD')}`} type="info" style={{ marginTop: '20px' }} />
        )}
      </Col>
      
    </Row>
  );
};

export default HojaRuta;
