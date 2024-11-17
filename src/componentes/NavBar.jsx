import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Importa useNavigate
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut, getAuth } from 'firebase/auth'; // Importa la función de cierre de sesión de Firebase
import appFirebase from '../credenciales'; // Importa la instancia de Firebase
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'; // Importa el ícono de escaneo de QR
import '../App.css';

const auth = getAuth(appFirebase); // Inicializa la instancia de autenticación de Firebase

const NavBar = ({ correoUsuario, onLogout }) => { // Pasa la función onLogout como una prop

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();  // Usa useNavigate para manejar la navegación

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Llama a la función onLogout para cerrar sesión
    await signOut(auth);
    onLogout(); // Llama a la función onLogout pasada como prop
  };

  return (
    <AppBar className='navbar' position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Coleman Gym
        </Typography>
        
        {/* Agregar el botón con el ícono de QR al lado derecho */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<QrCodeScannerIcon />}
          onClick={() => navigate('/qr-scanner')}  // Navegación usando useNavigate
          style={{ marginLeft: 'auto' }}  // Asegura que el botón se alinee a la derecha
        >
          QR
        </Button>

        <IconButton color="inherit" aria-label="menu" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
        
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem component={Link} to="/home" onClick={handleMenuClose}>Inicio</MenuItem>
          <MenuItem component={Link} to="/admins" onClick={handleMenuClose}>Administrador</MenuItem>
          <MenuItem component={Link} to="/earnings" onClick={handleMenuClose}>Ingresos</MenuItem>
          <MenuItem onClick={handleLogout}>Salir</MenuItem> {/* Llama a handleLogout en lugar de handleMenuClose */}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
