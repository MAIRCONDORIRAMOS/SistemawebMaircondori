import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Card, message, Modal, Steps, Result, Spin } from 'antd';
import { UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Step } = Steps;
const { Option } = Select;

 const Cliente = ({ idsesion }) => {

  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [price, setPrice] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const endpoint = 'https://back-end-plum.vercel.app/api';
  const [choferes, setChoferes] = useState([]);
  const [id_reservas, setId_reservas] = useState('');
  const [viajeDetails, setViajeDetails] = useState(null);
  const [confirming, setConfirming] = useState(false);
  //const [idsesions, setIdsesion] = useState('');
  const [estado , setEstado]=useState('');
  const [Precio , setPrecio]=useState('');
  const [Tiempo , setTiempo]=useState('');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { pickupLocation, destination, pickupTime, driver } = values;
      const reservaData = {
        id_cliente: '1',
        ubicacion_recogida: pickupLocation,
        destino: destination,
        fecha_hora: pickupTime.format('YYYY-MM-DD HH:mm'),
        id_chofer: driver
      };
      const response = await axios.post(`${endpoint}/reserva`, reservaData);
      setId_reservas(response.data.idreserva);

      // Crear el viaje automáticamente después de crear la reserva
      await axios.post(`${endpoint}/viaje`, { id_chofer: driver, id_reservas: response.data.idreserva });

      message.success('¡Reserva exitosa!');
      setCurrentStep(1);
      setConfirming(true);
      const res2 = await axios.get(`${endpoint}/viaje/reserva/${response.data.idreserva}/${idsesion}`);
      setViajeDetails(res2.data);
      setConfirming(false);
      setEstado(res2.data.estado);
      setPrecio(res2.data.precio)
      setTiempo(res2.data.tiempoderecogida);
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      message.error('Error al crear la reserva');
    }
    setLoading(false);
  };

  const handleDriverSelect = (value) => {
    setSelectedDriver(value);
  };

  const handleMapClick = (e) => {
    setSelectedLocation(e.latlng);
    setShowMapModal(false);
  };

  const handleAcceptBooking = () => {
    try{
    const response = axios.put(`${endpoint}/viaje/${id_reservas}`, {
      estado: 'confirmadocliente'
      //precio: values.precio,
      //tiempoderecogida: values.tiempoEstimado,
    });
    message.success('Se Confirmo esta Reserva');
    setCurrentStep(2); 
  }
   
  catch (error){
    message.error('Ocurrio un error intentelo mas tarde');
  }
  };

  const handleRejectBooking = () => {
    try{ const response = axios.put(`${endpoint}/viaje/${id_reservas}`, {
      estado: 'rechazadocliente'
      //precio: values.precio,
      //tiempoderecogida: values.tiempoEstimado,
    }); 
    message.success('Se rechazo o cancelo esta reserva');
    
    setCurrentStep(0); 
  }
   
    catch (error){
      message.error('Ocurrio un error intentelo mas tarde');
    }
   
  };

  const handleResetSteps = () => {
    setCurrentStep(0); // Volver al inicio
    form.resetFields(); // Limpiar los campos del formulario
  };


  useEffect(() => {
    
   
    const fetchChoferes = async () => {
      try {
        const response = await axios.get(`${endpoint}/choferes`);
        setChoferes(response.data);

        const respo = await axios.get(`${endpoint}/viaje/ultimo/${idsesion}`);
        const estatus = respo.data.estado;
        setId_reservas(respo.data.id_reservas);
        if (estatus === 'noconfirmado') {
          setCurrentStep(1);
          setEstado(respo.data.estado);
          setPrecio(respo.data.precio)
          setTiempo(respo.data.tiempoderecogida);
        } else if (estatus === 'confirmado') {
          setCurrentStep(1);
          setEstado(respo.data.estado);
          setPrecio(respo.data.precio)
          setTiempo(respo.data.tiempoderecogida);
        } else if (estatus === 'rechazado') {
          setCurrentStep(3);
        }else if (estatus === 'confirmadocliente') {
          setCurrentStep(2);
          setEstado(respo.data.estado);
          setPrecio(respo.data.precio)
          setTiempo(respo.data.tiempoderecogida);
        }else if (estatus ==='rechazadocliente'){
          setCurrentStep(0);
        }
      } catch (error) {
        console.error('Error al obtener la lista de choferes:', error);
      }
    };

    fetchChoferes();
  }, []);

  useEffect(() => {
    const fetchViajeDetails = async () => {
      try {
        if (id_reservas) {
          const response = await axios.get(`${endpoint}/viaje/reserva/${id_reservas}/${idsesion}`);
          setViajeDetails(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los detalles del viaje:', error);
        message.error('Error al obtener los detalles del viaje');
      }
    };

    fetchViajeDetails();
  }, [id_reservas]);

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <Steps current={currentStep} style={{ marginBottom: '20px' }}>
        <Step title="Reservar Viaje" />
        <Step title="Esperar Confirmación" />
        <Step title="Resultado" />
      </Steps>
      {currentStep === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '50%' }}>
            <Card title="Reservar Viaje">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="pickupLocation"
                  label="Ubicación de Recogida"
                  rules={[{ required: true, message: 'Por favor ingresa la ubicación de recogida' }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Ubicación de Recogida"
                  />
                </Form.Item>
                <Form.Item
                  name="destination"
                  label="Destino"
                  rules={[{ required: true, message: 'Por favor ingresa el destino' }]}
                >
                  <Input prefix={<EnvironmentOutlined />} placeholder="Destino" />
                </Form.Item>
                <Form.Item
                  name="pickupTime"
                  label="Fecha y Hora de Recogida"
                  rules={[{ required: true, message: 'Por favor selecciona la fecha y hora de recogida' }]}
                >
                  <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="driver"
                  label="Seleccionar Conductor"
                  rules={[{ required: true, message: 'Por favor selecciona un conductor' }]}
                >
                  <Select placeholder="Seleccionar Conductor" onChange={handleDriverSelect}>
                    {choferes.map(chofer => (
                      <Option key={chofer.id} value={chofer.id}>
                        {chofer.Nombre_completo} - {chofer.Placa}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Reservar
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
          {selectedDriver && (
            <div style={{ width: '50%', marginLeft: '20px' }}>
              <Card title="Detalles del Conductor Seleccionado">
                <p>Nombre: {choferes.find((chofer) => chofer.id === selectedDriver)?.Nombre_completo}</p>
                <p>Número de Teléfono: {choferes.find((chofer) => chofer.id === selectedDriver)?.Celular}</p>
                <p>Placa del Vehículo: {choferes.find((chofer) => chofer.id === selectedDriver)?.Placa}</p>
              </Card>
            </div>
          )}
        </div>
      )}
     {currentStep === 1 && (
         <div style={{ display: 'flex', justifyContent: 'center' }}>
       <Card title="Detalles del Viaje">
      <p>Estado: {estado === 'confirmado' ? 'Confirmado por el conductor' : 'Esperando respuesta del conductor'}</p>
      <p>Precio: { Precio }</p>
      <p>Tiempo de Recogida: {Tiempo}</p>
      {estado === 'confirmado' && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" onClick={handleAcceptBooking}>Aceptar</Button>
          <Button type="danger" onClick={handleRejectBooking}>Rechazar</Button>
        </div>
      )}
      {viajeDetails?.estado !== 'confirmado' && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Button type="danger" onClick={handleRejectBooking}>Cancelar</Button>
        </div>
      )}
    </Card>
  </div>
)}
      {currentStep === 2 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Result
            status="success"
            title="Reserva Aceptada"
            subTitle={`Precio: ${Precio} - Tiempo de Recogida: ${Tiempo}`}
            extra={
              <Button type="primary" onClick={handleResetSteps}>
                Nueva Reserva
              </Button>
            }
          />
        </div>
      )}
      {currentStep === 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Result
            status="error"
            title="El móvil no se encuentra disponible"
            subTitle="Por favor, selecciona otro conductor."
            extra={
              <Button type="primary" onClick={handleResetSteps}>
                Regresar
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};
export default Cliente;
