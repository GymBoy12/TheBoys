import { useState, useEffect } from 'react';
import { db } from "../../credenciales"; // Desde src/componentes/reportes/

import { collection, getDocs } from 'firebase/firestore';

const useClients = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsCollection = collection(db, 'clientes'); // Cambia 'clients' a 'clientes'
                const clientsSnapshot = await getDocs(clientsCollection);
                const clientsList = clientsSnapshot.docs.map(doc => ({
                    id: doc.id, // Para identificar cada cliente único
                    cedula: doc.data().Cedula,
                    edad: doc.data().edad,
                    fechaFinalizacion: doc.data().fechaFinalizacion,
                    nombre: doc.data().nombre,
                    pago: doc.data().pago
                }));
                setClients(clientsList);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    return clients;
};

export default useClients;
