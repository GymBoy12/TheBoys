// PDFReportButton.jsx
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import SweetAlert from 'sweetalert2';
import ClientListPDFGenerator from './ClientListPDFGenerator';
import useClients from './useClients';

const PDFReportButton = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [reportType, setReportType] = useState('todo');
    const [showPDFLink, setShowPDFLink] = useState(false);
    const clients = useClients();

    // Mostrar el diálogo
    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    // Cerrar el diálogo
    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    // Generar el reporte y cerrar el diálogo
    const handleGenerateReport = () => {
        setShowDialog(false); // Cierra el diálogo
        setShowPDFLink(true);  // Muestra el enlace para generar el PDF
    };

    // Filtrar clientes según la opción seleccionada
    const filterClients = (clients) => {
        const today = new Date();
        return clients.filter((client) => {
            const clientEndDate = new Date(client.fechaFinalizacion);
            if (reportType === 'activos') {
                return clientEndDate >= today; // Clientes cuya fecha fin no está vencida
            }
            if (reportType === 'vencidos') {
                return clientEndDate < today; // Clientes cuya fecha fin ya está vencida
            }
            return true; // Para 'todo', no se filtra nada
        });
    };

    // Agregar estado al cliente
    const clientsWithStatus = filterClients(clients).map(client => ({
        ...client,
        estado: new Date(client.fechaFinalizacion) < new Date() ? 'Vencido' : 'Activo',
    }));

    return (
        <div>
            {/* Botón para abrir el diálogo */}
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Generar Reporte de Clientes
            </Button>

            {/* Dialog de MUI */}
            <Dialog open={showDialog} onClose={handleCloseDialog}>
                <DialogTitle>Generar Reporte de Clientes</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Seleccione el tipo de reporte</FormLabel>
                        <RadioGroup
                            aria-label="reportType"
                            name="reportType"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <FormControlLabel value="todo" control={<Radio />} label="Todo" />
                            <FormControlLabel value="activos" control={<Radio />} label="Activos" />
                            <FormControlLabel value="vencidos" control={<Radio />} label="Vencidos" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    {/* Botón para cerrar el diálogo */}
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    {/* Botón para generar el reporte */}
                    <Button onClick={handleGenerateReport} color="primary">
                        Generar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Mostrar el enlace para descargar el PDF si se ha generado */}
            {showPDFLink && (
                <ClientListPDFGenerator clients={clientsWithStatus} />
            )}
        </div>
    );
};

export default PDFReportButton;
