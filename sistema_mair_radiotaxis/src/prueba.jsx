import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message } from 'antd';

const endpoint = 'http://localhost:8000/api';

const SocioTable = () => {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    fetchSocios();
  }, []);

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

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
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
      title: 'ID Grupo',
      dataIndex: 'id_grupo',
      key: 'id_grupo',
    },
  ];

  return (
    <Table dataSource={socios} columns={columns} />
  );
};

export default SocioTable;