import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore/lite";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmgIBr89RzYcIBEx_zlk4P7hvcUpVJ7G4",
    authDomain: "rn-image-server.firebaseapp.com",
    projectId: "rn-image-server",
    storageBucket: "rn-image-server.appspot.com",
    messagingSenderId: "750641998157",
    appId: "1:750641998157:web:ee8034c11f4df1d93e2f04",
    measurementId: "G-C9M330RYXT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app)
const db = getFirestore(app)

export {
  storage,
  db
}
