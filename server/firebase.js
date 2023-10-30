// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {getStorage, ref} = require('firebase/storage')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApZjkmyx1Pb1mlP9ttFETKO2-7g90OxR8",
  authDomain: "image-server-affba.firebaseapp.com",
  projectId: "image-server-affba",
  storageBucket: "image-server-affba.appspot.com",
  messagingSenderId: "686685654747",
  appId: "1:686685654747:web:1a83227a9bf58392b446fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storageBucket = getStorage(app)

module.exports = {
  storageBucket, ref
}

