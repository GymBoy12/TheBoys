import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ClientListPDFGenerator from './reportes/ClientListPDFGenerator'; // Reutilizamos este componente para generar PDFs si es necesario.
import useClients from './reportes/useClients'; // Simulamos que los ingresos se derivan de clientes.

const EarningsPage = () => {
    const [dailyEarnings, setDailyEarnings] = useState(0);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const clients = useClients();

    // Simula la obtención de ingresos
    useEffect(() => {
        const today = new Date();
        const daily = clients.reduce((acc, client) => {
            const paymentDate = new Date(client.fechaPago); // Suponiendo que tienes una fecha de pago en tu estructura de datos.
            if (
                paymentDate.getDate() === today.getDate() &&
                paymentDate.getMonth() === today.getMonth() &&
                paymentDate.getFullYear() === today.getFullYear()
            ) {
                return acc + client.mensualidad; // Suma la mensualidad.
            }
            return acc;
        }, 0);

        const monthly = clients.reduce((acc, client) => {
            const paymentDate = new Date(client.fechaPago);
            if (
                paymentDate.getMonth() === today.getMonth() &&
                paymentDate.getFullYear() === today.getFullYear()
            ) {
                return acc + client.mensualidad;
            }
            return acc;
        }, 0);

        setDailyEarnings(daily);
        setMonthlyEarnings(monthly);
    }, [clients]);

    // Generar reporte en PDF
    const handleGeneratePDF = () => {
        // Se pueden crear reportes de ingresos aquí o modificar el componente ClientListPDFGenerator.
        alert('Funcionalidad de generación de reportes aquí');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Ingresos del Gimnasio
            </Typography>
            <Typography variant="h6">Ingresos diarios: ${dailyEarnings}</Typography>
            <Typography variant="h6" gutterBottom>
                Ingresos mensuales: ${monthlyEarnings}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
                Generar Reporte PDF
            </Button>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha de Pago</TableCell>
                            <TableCell>Mensualidad</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.nombre}</TableCell>
                                <TableCell>{client.fechaPago}</TableCell>
                                <TableCell>${client.mensualidad}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EarningsPage;
