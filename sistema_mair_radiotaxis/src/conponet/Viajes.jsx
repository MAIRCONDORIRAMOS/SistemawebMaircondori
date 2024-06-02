import React, { useState, useEffect } from 'react';
import { Card, List, Button, Modal, message, Avatar, Divider, Tabs, Badge, Tooltip, Form, Input } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;
const { Meta } = Card;
const endpoint = 'https://back-end-plum.vercel.app/api';

const Viajes = ({id_chofer_socio}) => {
  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [reservasRealizadas, setReservasRealizadas] = useState([]);
  const [reservasRechazadas, setReservasRechazadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaIdActual, setReservaIdActual] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get(`${endpoint}/viajes/chofer/${id_chofer_socio}`);
        const { data } = response;
        const pendientes = data.filter(reserva => reserva.estado === 'noconfirmado');
        const realizadas = data.filter(reserva => reserva.estado === 'confirmadocliente');
        const rechazadas = data.filter(reserva => reserva.estado === 'rechazado' || reserva.estado === 'rechazadocliente');
        setReservasPendientes(pendientes);
        setReservasRealizadas(realizadas);
        setReservasRechazadas(rechazadas);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
        message.error('Error al obtener reservas');
      }
    };

    fetchReservas();
  }, []);
  const handleConfirmarReserva = (reservaId, form) => {
    alert(`ID de la reserva: ${reservaId}`);
    setReservaIdActual(reservaId);
    mostrarModalPrecioTiempo(form);
  };

  const handleRechazarReserva = (reservaId, motivoRechazo) => {
    Modal.confirm({
      title: 'Rechazar Reserva',
      content: (
        <div>
          <p>¿Estás seguro de que quieres rechazar esta reserva?</p>
          <Form form={form}>
            <Form.Item
              name="motivo"
              label="Motivo del Rechazo"
              rules={[{ required: true, message: 'Por favor ingresa el motivo del rechazo' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      ),
      onOk: () => {
        form.validateFields().then(values => {
          const reservaRechazada = reservasPendientes.find(reserva => reserva.reserva_id === reservaId);
  
          axios.put(`${endpoint}/viaje/${reservaId}`, {
            estado: 'rechazado',
           // motivoRechazo: values.motivo,
          })
          .then(() => {
            setReservasPendientes(reservasPendientes.filter(reserva => reserva.reserva_id !== reservaId));
            setReservasRechazadas([...reservasRechazadas, { ...reservaRechazada, motivoRechazo: values.motivo }]);
            message.warning('Reserva rechazada');
          })
          .catch(error => {
            console.error('Error al actualizar el viaje:', error);
            message.error('Error al rechazar la reserva');
          });
        }).catch(errorInfo => {
          console.log('Validation Failed:', errorInfo);
        });
      }
    });
  };
  

  const mostrarModalPrecioTiempo = (form) => {
    setModalVisible(true);
    form.resetFields();
  };
  const handleModalOk = (form) => {
    form.validateFields().then(values => {
      const reservaConfirmada = reservasPendientes.find(reserva => reserva.reserva_id === reservaIdActual);

      axios.put(`${endpoint}/viaje/${reservaIdActual}`, {
        estado: 'confirmado',
        precio: values.precio,
        tiempoderecogida: values.tiempoEstimado,
      })
        .then(() => {
          setReservasPendientes(reservasPendientes.filter(reserva => reserva.reserva_id !== reservaIdActual));
          setReservasRealizadas([...reservasRealizadas, reservaConfirmada]);
          setModalVisible(false);
          message.success('Reserva confirmada exitosamente');
        })
        .catch(error => {
          console.error('Error al actualizar el viaje:', error);
          message.error('Error al confirmar la reserva');
        });
    }).catch(errorInfo => {
      console.log('Validation Failed:', errorInfo);
    });
  };
  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <h1 style={{ marginTop: 0 }}>Reservas</h1>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab={<span>Pendientes <Badge count={reservasPendientes.length} style={{ backgroundColor: '#f50' }} /></span>} key="1">
          <ListadoReservas
            reservas={reservasPendientes}
            handleConfirmarReserva={handleConfirmarReserva}
            handleRechazarReserva={handleRechazarReserva}
            loading={loading}
            form={form}
          />
        </TabPane>
        <TabPane tab={<span>Realizadas <Badge count={reservasRealizadas.length} style={{ backgroundColor: '#87d068' }} /></span>} key="2">
          <ListadoReservasPequeno reservas={reservasRealizadas} tipo="Realizadas" />
        </TabPane>
        <TabPane tab={<span>Rechazadas <Badge count={reservasRechazadas.length} style={{ backgroundColor: '#108ee9' }} /></span>} key="3">
          <ListadoReservasPequeno reservas={reservasRechazadas} tipo="Rechazadas" />
        </TabPane>
      </Tabs>
      <Modal
        title="Detalle del Viaje"
        visible={modalVisible}
        onOk={() => handleModalOk(form)}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form}>
          <Form.Item name="reservaId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="precio"
            label="Precio del Viaje"
            rules={[{ required: true, message: 'Por favor ingresa el precio del viaje' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tiempoEstimado"
            label="Tiempo Estimado de Llegada a Recoger"
            rules={[{ required: true, message: 'Por favor ingresa el tiempo estimado de llegada a recoger' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ListadoReservas = ({ reservas, handleConfirmarReserva, handleRechazarReserva, loading, form }) => (
  <List
    grid={{ gutter: 16, column: 2 }}
    dataSource={reservas}
    renderItem={reserva => (
      <List.Item>
        <Card
          title={`Cliente: ${reserva.nombre_cliente} ${reserva.apellido_cliente}`}
          extra={<Button type="primary" onClick={() => {
            handleConfirmarReserva(reserva.reserva_id, form);
            form.setFieldsValue({ reservaId: reserva.reserva_id });
          }}>Confirmar</Button>}
        >
          <Meta
            avatar={<Avatar icon="user" />}
            title={`Ubicación de Recogida: ${reserva.ubicacion_recogida}`}
            description={`Destino: ${reserva.destino}`}
          />
          <Divider />
          <p>Fecha y Hora de Recogida: {reserva.fecha_hora}</p>
          <Button onClick={() => handleRechazarReserva(reserva.reserva_id)}>Rechazar</Button>
        </Card>
      </List.Item>
    )}
  />
);

const ListadoReservasPequeno = ({ reservas, tipo }) => (
  <List
    dataSource={reservas}
    renderItem={reserva => (
      <List.Item>
        <Tooltip title={`Motivo del Rechazo: ${reserva.motivoRechazo}`}>
          <Card
            title={`Cliente: ${reserva.nombre_cliente} ${reserva.apellido_cliente}`}
            style={{ width: 300 }}
          >
            <p>Ubicación de Recogida: {reserva.ubicacion_recogida}</p>
            <p>Destino: {reserva.destino}</p>
            <p>Fecha y Hora de Recogida: {reserva.fecha_hora}</p>
          </Card>
        </Tooltip>
      </List.Item>
    )}
  />
);

export default Viajes;
