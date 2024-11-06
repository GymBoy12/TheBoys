import React from 'react';
import useClients from '../hooks/useClients.js';
import ClientListPDFGenerator from './ClientListPDFGenerator.jsx';

const PDFPage = () => {
  const { clients, loading, error } = useClients();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Generar PDF de Clientes</h1>
      <ClientListPDFGenerator clients={clients} />
    </div>
  );
};

export default PDFPage;
