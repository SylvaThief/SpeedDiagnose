// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { initializeApp } from "firebase/app"; // Esto no debería estar aquí

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
