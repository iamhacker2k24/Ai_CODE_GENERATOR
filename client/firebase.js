// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqAUqOE3iXwldQWmmc6giiqhAfZNwD_do",
    authDomain: "genai-2f18b.firebaseapp.com",
    projectId: "genai-2f18b",
    storageBucket: "genai-2f18b.firebasestorage.app",
    messagingSenderId: "53071623732",
    appId: "1:53071623732:web:f17159d22e093de4b27c61",
    measurementId: "G-TT7VGCV812"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }

// 2.13