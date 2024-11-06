// credenciales.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNuBBP3dA_7EHsfeewosiZAN1COqQDpX8",
  authDomain: "colemangym-11ff0.firebaseapp.com",
  projectId: "colemangym-11ff0",
  storageBucket: "colemangym-11ff0.appspot.com",
  messagingSenderId: "782070159487",
  appId: "1:782070159487:web:23d99de9509999e923474a"
};

// Inicializa Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase); // Inicializa Firestore

export { db };
