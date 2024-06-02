import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import jsPDF from 'jspdf';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const ReportajePDF = ({ reportajeData }) => {
  // Crear un nuevo documento PDF
  const doc = new jsPDF();

  // Agregar contenido al documento
  doc.text(`ID Reportaje: ${reportajeData.id_reportaje}`, 10, 10);
  doc.text(`Nombre Socio: ${reportajeData.nombre_socio}`, 10, 20);
  doc.text(`Celular: ${reportajeData.Celular}`, 10, 30);
  doc.text(`Dirección: ${reportajeData.Direccion}`, 10, 40);
  doc.text(`Licencia: ${reportajeData.Licencia}`, 10, 50);
  doc.text(`Placa: ${reportajeData.Placa}`, 10, 60);
  doc.text(`Grupo Socio: ${reportajeData.nombre_grupo_socio}`, 10, 70);
  doc.text(`Parada: ${reportajeData.Nombre_parada}`, 10, 80);
  doc.text(`Grupo Parada: ${reportajeData.nombre_grupo_parada}`, 10, 90);

  // Descargar el documento PDF
  doc.save('reportaje.pdf');

  return null; // No es necesario renderizar nada en este componente
};

export default ReportajePDF;