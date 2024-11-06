import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import useClients from '../hooks/useClients';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  clientInfo: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// Componente para el contenido del PDF
const ClientListPDF = ({ clients }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Lista de Clientes</Text>
        {clients.map((client, index) => (
          <Text key={index} style={styles.clientInfo}>
            {client.nombre} - Cédula: {client.cedula} - Edad: {client.edad} - Fecha Finalización: {client.fechaFinalizacion} - Pago: {client.pago}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

// Componente principal para generar el PDF
const ClientListPDFGenerator = ({ clients }) => (
  <PDFDownloadLink document={<ClientListPDF clients={clients} />} fileName="lista_clientes.pdf">
    {({ blob, url, loading, error }) =>
      loading ? 'Generando PDF...' : 'Descargar PDF'
    }
  </PDFDownloadLink>
);

export default ClientListPDFGenerator;