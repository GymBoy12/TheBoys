// ClientListPDFGenerator.jsx
import React from 'react';
import { Page, Text, View, Document, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
import useClients from './useClients';

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        borderBottom: '1px solid black',
        paddingBottom: 5,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    columnHeader: {
        width: '20%',
        fontWeight: 'bold',
        fontSize: 12,
    },
    column: {
        width: '20%',
        fontSize: 10,
    },
    statusActive: {
        color: 'green',
    },
    statusExpired: {
        color: 'red',
    },
});

// Define el documento PDF
const ClientListPDFGenerator = ({ clients }) => {
    return (
        <PDFDownloadLink
            document={
                <Document>
                    <Page style={styles.page}>
                        <Text style={styles.title}>Lista de Clientes del Gimnasio</Text>

                        {/* Encabezado de la tabla */}
                        <View style={styles.header}>
                            <Text style={styles.columnHeader}>Cédula</Text>
                            <Text style={styles.columnHeader}>Nombre</Text>
                            <Text style={styles.columnHeader}>Edad</Text>
                            <Text style={styles.columnHeader}>Pago</Text>
                            <Text style={styles.columnHeader}>Fecha Fin</Text>
                            <Text style={styles.columnHeader}>Estado</Text>
                        </View>

                        {/* Filas de la tabla con datos de los clientes */}
                        {clients.map((client) => (
                            <View key={client.id} style={styles.row}>
                                <Text style={styles.column}>{client.cedula}</Text>
                                <Text style={styles.column}>{client.nombre}</Text>
                                <Text style={styles.column}>{client.edad}</Text>
                                <Text style={styles.column}>{client.pago}</Text>
                                <Text style={styles.column}>{client.fechaFinalizacion}</Text>
                                <Text
                                    style={client.estado === 'Activo' ? styles.statusActive : styles.statusExpired}
                                >
                                    {client.estado}
                                </Text>
                            </View>
                        ))}
                    </Page>
                </Document>
            }
            fileName="lista_clientes_gimnasio.pdf"
        >
            {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar Lista de Clientes')}
        </PDFDownloadLink>
    );
};

export default ClientListPDFGenerator;
