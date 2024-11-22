// environment.ts

import { initializeApp } from "firebase/app";  // Esto debe estar aquí

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyA2NI8ec_GZq6rUX1ngIG-pycS-LZNRcLE",
    authDomain: "speeddiagnose2024.firebaseapp.com",
    projectId: "speeddiagnose2024",
    storageBucket: "speeddiagnose2024.appspot.com",
    messagingSenderId: "1078100561218",
    appId: "1:1078100561218:web:8039d23073c58eaa21ccdb"
  }
};

// Inicializa la app de Firebase directamente aquí
initializeApp(environment.firebaseConfig);
