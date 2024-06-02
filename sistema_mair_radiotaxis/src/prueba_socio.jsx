import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, Select, message } from 'antd';

const { Option } = Select;
const endpoint = 'http://localhost:8000/api';

const SocioForm = () => {
  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [licencia, setLicencia] = useState('');
  const [placa, setPlaca] = useState('');
  const [grupoId, setGrupoId] = useState('');
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      const response = await axios.get(`${endpoint}/grupos`);
      setGrupos(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validar los campos obligatorios
      if (!nombre || !ci || !celular || !direccion || !licencia || !placa || !grupoId) {
        message.error('Por favor completa todos los campos');
        return;
      }

      // Enviar solicitud para crear un nuevo socio
      await axios.post(`${endpoint}/socio`, {
        Nombre: nombre,
        Ci: ci,
        Celular: celular,
        Direccion: direccion,
        Licencia: licencia,
        Placa: placa,
        id_grupo: grupoId
      });

      // Limpiar los campos después de enviar la solicitud
      setNombre('');
      setCi('');
      setCelular('');
      setDireccion('');
      setLicencia('');
      setPlaca('');
      setGrupoId('');

      // Mostrar mensaje de éxito
      message.success('Socio creado exitosamente');
    } catch (error) {
      console.error('Error creating socio:', error.response.data);
      // Mostrar mensaje de error si falla la solicitud
      message.error('Error al crear el socio');
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Socio:</h2>
      <Input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        style={{ marginBottom: 10 }}
        placeholder="Nombre"
      />
      <Input
        value={ci}
        onChange={e => setCi(e.target.value)}
        style={{ marginBottom: 10 }}
        placeholder="CI"
      />
      <Input
        value={celular}
        onChange={e => setCelular(e.target.value)}
        style={{ marginBottom: 10 }}
        placeholder="Celular"
      />
      <Input
        value={direccion}
        onChange={e => setDireccion(e.target.value)}
        style={{ marginBottom: 10 }}
        placeholder="Dirección"
      />
      <Input
        value={licencia}
        onChange={e => setLicencia(e.target.value)}
        style={{ marginBottom: 10 }}
        placeholder="Licencia"
      />
      <Input
        value={placa}
        onChange={e => setPlaca(e.target.value)}
        style={{ marginBottom: 10 }}
        placeholder="Placa"
      />
      <Select
        value={grupoId}
        onChange={value => setGrupoId(value)}
        style={{ width: 200, marginBottom: 10 }}
        placeholder="Seleccione un grupo"
      >
        {grupos.map(grupo => (
          <Option key={grupo.id} value={grupo.id}>
            {grupo.Nombre_grupo}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleSubmit}>Crear Socio</Button>
    </div>
  );
};

export default SocioForm;
