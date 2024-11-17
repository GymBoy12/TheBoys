import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Importar QRCodeCanvas para personalización
import logoqr from '../assets/logoqr.png'; // Asegúrate de que esta ruta sea correcta
import Consultas from './Consultas'; 

const Verificar = () => {
  const [open, setOpen] = useState(true);
  const [cedula, setCedula] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [cedulaNotFound, setCedulaNotFound] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);  // Estado para controlar la visibilidad del modal del QR
  const [qrImage, setQrImage] = useState(null);  // Estado para guardar la imagen del QR generado

  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleVerificarCedula = async () => {
    try {
      setVerifying(true);
      const db = getFirestore();
      const clientesQuery = query(collection(db, 'clientes'), where('Cedula', '==', cedula));
      const snapshot = await getDocs(clientesQuery);

      if (!snapshot.empty) {
        const cliente = snapshot.docs[0].data();
        setClienteEncontrado({ id: snapshot.docs[0].id, ...cliente });
        setCedulaNotFound(false);
        handleClose();
      } else {
        setClienteEncontrado(null);
        setCedulaNotFound(true);
      }
    } catch (error) {
      console.error('Error al verificar la cédula:', error);
    } finally {
      setVerifying(false);
    }
  };

  // Función para generar el QR y abrir el modal
  const handleGenerateQR = () => {
    setQrModalOpen(true);
  };

  // Función para descargar el QR con el nombre del cliente debajo y el nombre del gimnasio arriba
  const handleDownloadQR = () => {
    const canvas = document.getElementById("qrCanvas");
    const qrUrl = canvas.toDataURL("image/png");  // Convertir el QR a una URL de imagen
    
    // Crear un canvas de nuevo para agregar el nombre debajo del QR
    const img = new Image();
    img.src = qrUrl;
    img.onload = () => {
      const qrCanvas = document.createElement("canvas");
      const ctx = qrCanvas.getContext("2d");

      const qrWidth = img.width;
      const qrHeight = img.height;

      // Establecer el tamaño del canvas (añadir espacio para el título, QR y nombre del cliente)
      qrCanvas.width = qrWidth + 40; // Margen alrededor del QR
      qrCanvas.height = qrHeight + 160; // Espacio para el nombre del gimnasio y del cliente

      // Dibujar un fondo blanco con bordes redondeados
      ctx.fillStyle = "#FFFFFF"; // Fondo blanco
      ctx.beginPath();
      ctx.moveTo(20, 0); // Esquina superior izquierda
      ctx.lineTo(qrCanvas.width - 20, 0); // Esquina superior derecha
      ctx.lineTo(qrCanvas.width - 20, qrCanvas.height - 20); // Esquina inferior derecha
      ctx.lineTo(20, qrCanvas.height - 20); // Esquina inferior izquierda
      ctx.closePath();
      ctx.fill();

      // Crear el color sólido para el QR y el texto (#F74E2A)
      const qrColor = "#F74E2A";  // Color rojo especificado

      // Dibujar el QR en el canvas (centrado en la tarjeta) con bordes redondeados
      ctx.fillStyle = qrColor;
      ctx.beginPath();
      ctx.moveTo((qrCanvas.width - qrWidth) / 2 + 20, 50);
      ctx.lineTo((qrCanvas.width + qrWidth) / 2 - 20, 50);
      ctx.lineTo((qrCanvas.width + qrWidth) / 2 - 20, qrHeight + 50);
      ctx.lineTo((qrCanvas.width - qrWidth) / 2 + 20, qrHeight + 50);
      ctx.closePath();
      ctx.fill();

      // Dibujar la imagen del QR sobre el fondo del color especificado
      ctx.drawImage(img, (qrCanvas.width - qrWidth) / 2, 50);  // Dejar margen superior

      // Agregar el logo como marca de agua
      const logo = new Image();
      logo.src = logoqr;
      logo.onload = () => {
        const logoWidth = 50;  // Ajusta el tamaño del logo para la marca de agua
        const logoHeight = 50;
        const logoCountX = Math.ceil(qrCanvas.width / logoWidth);
        const logoCountY = Math.ceil(qrCanvas.height / logoHeight);

        // Dibujar el logo repetidamente como marca de agua
        for (let i = 0; i < logoCountX; i++) {
          for (let j = 0; j < logoCountY; j++) {
            ctx.globalAlpha = 0.1;  // Ajustar la opacidad para hacerlo tenue
            ctx.drawImage(logo, i * logoWidth, j * logoHeight, logoWidth, logoHeight);
          }
        }

        // Establecer el estilo para el texto
        ctx.globalAlpha = 1;
        ctx.font = "28px Arial";
        ctx.fillStyle = qrColor;  // Color del texto en #F74E2A
        ctx.textAlign = "center";

        // Dibujar el nombre del gimnasio en la parte superior
        ctx.fillText("BOYGYM", qrCanvas.width / 2, 40);  // Título del gimnasio

        // Dibujar el nombre del cliente debajo del QR
        ctx.font = "20px Arial";
        ctx.fillStyle = qrColor;  // Color del texto en #F74E2A
        ctx.fillText(clienteEncontrado.nombre, qrCanvas.width / 2, qrHeight + 90);  // Nombre del cliente

        // Convertir el canvas a imagen y permitir la descarga
        const qrWithNameUrl = qrCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = qrWithNameUrl;
        link.download = `credencial_${clienteEncontrado.nombre}.png`;  // Nombre del archivo descargado
        link.click();
      };
    };
  };

  return (
    <div>
      <h1>Verificar</h1>
      <Button onClick={() => navigate('/login')}>Volver a Inicio</Button>
                {/* Botón para generar el QR */}
                <Button onClick={handleGenerateQR}>Generar Código QR</Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Ingrese el número de CI:
          </Typography>
          <TextField
            id="cedula"
            label="Cédula del cliente"
            variant="outlined"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          {cedulaNotFound && <Alert severity="error">CI inexistente</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/login')}>Cancelar</Button>
          <Button onClick={handleVerificarCedula} disabled={verifying}>
            {verifying ? <CircularProgress color="success" size={24} /> : 'Verificar'}
          </Button>
        </DialogActions>
      </Dialog>

      {clienteEncontrado && (
        <div>
          <Typography variant="h4" gutterBottom>
            Cliente
          </Typography>
          <Typography variant="body1" gutterBottom>
            Nombre: {clienteEncontrado.nombre}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Edad: {clienteEncontrado.edad}
          </Typography>
          <Typography variant="body1" gutterBottom>
            CI: {clienteEncontrado.Cedula}
          </Typography>

         {/* Aquí agregamos el componente Consultas */}
    <Consultas clienteId={clienteEncontrado.id} />

          {/* Modal para mostrar el QR generado */}
          <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
            <DialogContent>
              <Typography variant="h5" gutterBottom>
                Código QR del cliente
              </Typography>
              {clienteEncontrado && (
                <div style={{ textAlign: 'center' }}>
                  <QRCodeCanvas
                    id="qrCanvas"
                    value={`${clienteEncontrado.id}|${clienteEncontrado.nombre}|${clienteEncontrado.edad}|${clienteEncontrado.pago}|${clienteEncontrado.fechaFinalizacion}`} // Datos personalizados
                    size={250}
                    bgColor="#FFFFFF"  // Fondo blanco para el QR
                    fgColor="#F74E2A"  // Color del QR en #F74E2A
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: logoqr,
                      x: null,
                      y: null,
                      height: 40,
                      width: 40,
                      excavate: true
                    }}
                  />
                </div>
              )}
              <Button onClick={handleDownloadQR}>Descargar QR</Button>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
    </div>
  );
};

export default Verificar;
