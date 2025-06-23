import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// All keys are safe to include since security is set up in firebase.
const firebaseConfig = {
    apiKey: "AIzaSyCsT-fbntjDPWfv9NN8O28D6JILh4r59m0",
    authDomain: "codehub-249f3.firebaseapp.com",
    databaseURL: "https://codehub-249f3-default-rtdb.firebaseio.com",
    projectId: "codehub-249f3",
    storageBucket: "codehub-249f3.firebasestorage.app",
    messagingSenderId: "427909026000",
    appId: "1:427909026000:web:6e5732c7423989bbb94ed5",
    measurementId: "G-C70ZKEGG3S",
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
