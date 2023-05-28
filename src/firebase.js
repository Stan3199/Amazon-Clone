import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHIgy-tbhWA57DjnwkWAsFYhpkiausQG0",
  authDomain: "fir-d374a.firebaseapp.com",
  projectId: "fir-d374a",
  storageBucket: "fir-d374a.appspot.com",
  messagingSenderId: "500155665736",
  appId: "1:500155665736:web:a41f472bd5f17f7225f77d",
  measurementId: "G-MLXM7M40XT"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db, auth};