import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

// Config firebase with our WebApp
const firebaseConfig = {
    apiKey: "AIzaSyCAIhbMCmdGh7SHVLWi8qtSOXwpcDMUcfI",
    authDomain: "online-chat-d8729.firebaseapp.com",
    projectId: "online-chat-d8729",
    storageBucket: "online-chat-d8729.appspot.com",
    messagingSenderId: "543961727358",
    appId: "1:543961727358:web:5fd46f46fd8f98e292732f",
    measurementId: "G-XJYSGZ5NH1"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);