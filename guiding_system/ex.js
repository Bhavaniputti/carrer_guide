const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, ref, set, get, child } = require("firebase/database");
const path = require("path");
require("dotenv").config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const pages = ["index", "login", "register", "dashboard", "learningpath"];
pages.forEach(page => app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, "public", `${page}.html`))));

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await set(ref(db, `users/${user.uid}`), { email });
        res.status(201).json({ message: "User registered successfully", user: { uid: user.uid, email } });
    } catch (error) {
        let errorMessage = "Error registering user";
        if (error.code === "auth/email-already-in-use") {
            errorMessage = "User already exists";
        }
        res.status(400).json({ error: errorMessage });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        res.status(200).json({ message: "Login successful", user: { uid: user.uid, email } });
    } catch (error) {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
