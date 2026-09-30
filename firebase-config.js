import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBAfcSFq3iX5kwn9eCW9eEsxiyLd0Q-kyM",
    authDomain: "bookme-1cfde.firebaseapp.com",
    databaseURL: "https://bookme-1cfde-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bookme-1cfde",
    storageBucket: "bookme-1cfde.firebasestorage.app",
    messagingSenderId: "947664207822",
    appId: "1:947664207822:web:dd27befa1f6a087561759f"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


export {
    app,
    auth,
    db
};