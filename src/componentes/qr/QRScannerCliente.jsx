import React, { useState } from 'react';
import QRScanner from 'react-qr-scanner'; // Importa correctamente react-qr-scanner
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Button, CircularProgress, Typography, Alert } from '@mui/material';

const QRScannerCliente = () => {
  const [clienteId, setClienteId] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data) {
      const [idCliente] = data.text.split('|'); // Obtener solo el ID antes del "|"
      setClienteId(idCliente);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  // Buscar el cliente por ID
  const fetchCliente = async () => {
    if (!clienteId) return;

    try {
      setLoading(true);
      const db = getFirestore();
      const clienteDoc = await getDoc(doc(db, 'clientes', clienteId));

      if (clienteDoc.exists()) {
        const data = clienteDoc.data();
        setCliente(data);
      } else {
        setError('Cliente no encontrado.');
      }
    } catch (error) {
      setError('Error al obtener datos del cliente.');
      console.error('Error al obtener datos del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los datos del cliente cuando se obtiene un ID
  React.useEffect(() => {
    fetchCliente();
  }, [clienteId]);

  const resetScanner = () => {
    setClienteId(null);
    setCliente(null);
    setError(null);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {clienteId ? 'Detalles del Cliente' : 'Escáner QR'}
      </Typography>

      {clienteId ? (
        loading ? (
          <CircularProgress />
        ) : cliente ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Detalles del Cliente
            </Typography>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>Edad:</strong> {cliente.edad}</p>
            <p><strong>CI:</strong> {cliente.Cedula}</p>
            <Button
              variant="contained"
              onClick={resetScanner}
              style={{ marginTop: '20px' }}
            >
              Escanear otro QR
            </Button>
          </div>
        ) : (
          <Alert severity="error">{error || 'No se pudo cargar la información del cliente.'}</Alert>
        )
      ) : (
        <div>
          <QRScanner
            delay={300} // Configura el delay de escaneo
            style={{ width: '100%', height: '100%' }}
            onScan={handleScan}  // Función que se ejecuta cuando escanea un QR
            onError={handleError} // Función que maneja errores
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/')}
            style={{ marginTop: '20px' }}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRScannerCliente;
