import React, { useState , useEffect} from 'react';
import { Modal, Card, Typography, Button, Space, Radio, Input, Select, notification, Row ,List } from 'antd';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaMapMarkedAlt } from 'react-icons/fa';

const { Meta } = Card;
const { Title } = Typography;
const { Option } = Select;
const endpoint = 'https://back-end-plum.vercel.app/api'
const ParadaCard = ({ parada, onClick }) => {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
 
  const getLuminance = (color) => {
    const hex = color.replace(/#/, '');
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  let cardColor;
  let textColor;
  do {
    cardColor = getRandomColor();
    textColor = getLuminance(cardColor) > 180 ? '#000' : '#fff'; // Seleccionar texto blanco para colores claros
  } while (getLuminance(cardColor) < 180 || getLuminance(cardColor) > 220); // Ajustar el rango de luminancia según tus preferencias

  const cardStyle = {
    width: '14em', // Ajustar tamaño de las cards de manera responsiva
    margin: '0.8em',
    display: 'inline-block',
    verticalAlign: 'top',
    backgroundColor: cardColor,
    color: textColor,
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  };

  const iconContainerStyle = {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: '50%',
    padding: 5,
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onClick(parada)}>
      <Card style={cardStyle} hoverable>
        <div style={iconContainerStyle}>
          <FaMapMarkedAlt color={cardColor} size={32} />
        </div>
        <Meta title={parada.Nombre_parada} description={`Grupo: ${parada.id_grupo}`} />
      </Card>
    </motion.div>
  );
};

const General = () => {
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalActualizarVisible, setModalActualizarVisible] = useState(false);
  const [modalParadaVisible, setModalParadaVisible] = useState(false);
  const [paradaSeleccionada, setParadaSeleccionada] = useState(null); // Usar null en lugar de una cadena vacía
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [responsableSeleccionado, setResponsableSeleccionado] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [direccionParada, setDireccionParada] = useState("");
  const [nombreGrupo, setNombreGrupo] = useState('');
  useEffect(() => {
    const fetchParadas = async () => {
      try {
        const response = await axios.get(`${endpoint}/paradas`);
        setParadas(response.data);
      } catch (error) {
        console.error('Error al obtener datos de las paradas:', error);
      }
    };

    const fetchGrupos = async () => {
      try {
        const response = await axios.get(`${endpoint}/grupos`);
        setGrupos(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de grupos:', error);
      }
    };

    fetchParadas();
    fetchGrupos();
  }, []);

  const handleParadaClick = (parada) => {
    setParadaSeleccionada(parada);
    setModalParadaVisible(true);
  };

  
  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };
  const handleGuardar = async () => {
    try {
      const response = await axios.post(`${endpoint}/parada`, {
        Nombre_parada: direccionParada,
        id_grupo: grupoSeleccionado
      });
      console.log(response.data);
      setModalAgregarVisible(false);
      openNotificationWithIcon('success', 'Éxito', 'La parada se agregó correctamente.');
      setParadas([...paradas, { id: response.data.id, Nombre_parada: direccionParada, id_grupo: grupoSeleccionado }]);
      setDireccionParada('');
      setGrupoSeleccionado(null);
    } catch (error) {
      console.error('Error al agregar la parada:', error);
      openNotificationWithIcon('error', 'Error', 'Ocurrió un error al agregar la parada. Por favor, inténtalo de nuevo.');
    }
  };
  const handleGuardarGrupo = async () => {
    try {
      const response = await axios.post(`${endpoint}/grupo`, {
        Nombre_grupo: nombreGrupo
      });
      console.log(response.data);
      setModalActualizarVisible(false)
      openNotificationWithIcon('success', 'Éxito', 'El grupo se agregó correctamente.');
      setGrupos([...grupos, { id: response.data.id, Nombre_grupo: nombreGrupo }]);
      setNombreGrupo('');
    } catch (error) {
      console.error('Error al agregar el grupo:', error);
      openNotificationWithIcon('error', 'Error', 'Ocurrió un error al agregar el grupo. Por favor, inténtalo de nuevo.');
    }
  };
  const handleActualizar = async () => {
    try {
      const response = await axios.put(`${endpoint}/parada/${paradaSeleccionada.id}`, {
        id_grupo: grupoSeleccionado,
      });
      console.log(response.data);
      setModalParadaVisible(false);
      openNotificationWithIcon('success', 'Éxito', 'El grupo de la parada se actualizó correctamente.');
      
      // Actualizar la lista de paradas después de la actualización
      const updatedParadas = paradas.map(parada => {
        if (parada.id === paradaSeleccionada.id) {
          return { ...parada, id_grupo: grupoSeleccionado };
        }
        return parada;
      });
      setParadas(updatedParadas);
    } catch (error) {
      console.error('Error al actualizar el grupo de la parada:', error);
      openNotificationWithIcon('error', 'Error', 'Ocurrió un error al actualizar el grupo de la parada. Por favor, inténtalo de nuevo.');
    }
  };
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>  
    <Space wrap="wrap" gap="small" direction="vertical" style={{ padding: 20 }}>
      <Radio.Group defaultValue="a" buttonStyle="solid">
        <Radio.Button value="a" onClick={() => setModalAgregarVisible(true)}>Agregar Nueva Parada</Radio.Button>
        <Radio.Button value="act" onClick={() => setModalActualizarVisible(true)}>Agregar Nuevo grupo</Radio.Button>
      </Radio.Group>

      <Modal
        title="Agregar Nueva Parada"
        visible={modalAgregarVisible}
        onCancel={() => setModalAgregarVisible(false)}
        footer={[
          <Button key="cancelar" onClick={() => setModalAgregarVisible(false)}>
            Cancelar
          </Button>,
          <Button key="guardar" type="primary" onClick={handleGuardar}>
            Guardar
          </Button>,
        ]}
      >
        <div style={{ margin: '20px 0' }}>
          <Input 
            placeholder="Dirección de la Parada" 
            style={{ margin: '10px 0' }} 
            value={direccionParada} 
            onChange={(e) => setDireccionParada(e.target.value)} // Actualizar el estado al cambiar el valor del input
          />
          <Select 
            placeholder="Seleccione un grupo" 
            style={{ width: '100%', marginBottom: '1em' }} 
            onChange={(value) => setGrupoSeleccionado(value)} 
            value={grupoSeleccionado}
          >
            {grupos.map((grupo) => (
              <Option key={grupo.id} value={grupo.id}>
                {grupo.Nombre_grupo}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
      <Modal
        title="Agregar Nuevo Grupo"
        visible={modalActualizarVisible}
        onCancel={() => setModalActualizarVisible(false)}
        footer={[
          <Button key="cancelar" onClick={() => setModalActualizarVisible(false)}>
            Cancelar
          </Button>,
          <Button key="actualizar" type='primary'color='green'  onClick={handleGuardarGrupo}>
            Agregar
          </Button>,
        ]}
      >
        <div style={{ margin: '20px 0' }}>
          
          <Input placeholder="Nombre del Grupo ejm. Grupo 1 " style={{ margin: '10px 0' }}
           value={nombreGrupo}
           onChange={(e) => setNombreGrupo(e.target.value)}
          />
        
        </div>
      </Modal>

      <Modal
        title="Detalles de la Parada"
        visible={modalParadaVisible}
        onCancel={() => setModalParadaVisible(false)}
        footer={[
          <Button key="cancelar" onClick={() => setModalParadaVisible(false)}>
            Cancelar
          </Button>,
          <Button key="guardar" type="primary" onClick={handleActualizar}>
            Guardar
          </Button>,
        ]}
      >
        <p>Nombre de la parada: {paradaSeleccionada?.Nombre_parada}</p>
        <p>Grupo asignado: {paradaSeleccionada?.id_grupo}</p>
        <Select 
            placeholder="Asignar Grupo" 
            style={{ width: '100%', marginBottom: '1em' }} 
            onChange={(value) => setGrupoSeleccionado(value)} 
            value={grupoSeleccionado}
          >
            {grupos.map((grupo) => (
              <Option key={grupo.id} value={grupo.id}>
                {grupo.Nombre_grupo}
              </Option>
            ))}
          </Select>
       
      </Modal>

      <div style={{ width: '100%' }}>
          <h2>Paradas</h2>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={paradas}
            renderItem={parada => (
              <List.Item>
                <ParadaCard parada={parada} onClick={handleParadaClick} />
              </List.Item>
            )}
          />
        </div>
    </Space>
    </Row>
  );
};

export default General;
