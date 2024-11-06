import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import {bd} from '../../credenciales';
const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientesCollection = collection(db, 'clientes');
        const clientesSnapshot = await getDocs(clientesCollection);
        const clientesList = clientesSnapshot.docs.map(doc => ({
          id: doc.id,
          cedula: doc.data().Cedula,
          edad: doc.data().edad,
          fechaFinalizacion: doc.data().fechaFinalizacion,
          nombre: doc.data().nombre,
          pago: doc.data().pago
        }));
        setClients(clientesList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clients: ", err);
        setError('Error al obtener los clientes');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
};

export default useClients;