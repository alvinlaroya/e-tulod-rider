import firebase from "firebase";

// Optionally import the services that you want to use
import "firebase/auth";
/* import "firebase/database"; */
import "firebase/firestore";
/* import "firebase/functions"; */
import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZ3WCsXh_ZdvNWqmdvJiCHq_q622moHV4",
  authDomain: "e-tulod.firebaseapp.com",
  projectId: "e-tulod",
  storageBucket: "e-tulod.appspot.com",
  messagingSenderId: "292636393408",
  appId: "1:292636393408:web:9030acbd9fe57d62a89225",
  measurementId: "G-9W6K2WBHT2",
};

export const fb = firebase.initializeApp(firebaseConfig);
/* firebase.firestore().settings({ experimentalForceLongPolling: true }); */
