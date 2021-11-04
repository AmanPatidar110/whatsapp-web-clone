import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC8hGyPtUHyM_RvJq2u-8PZSAfIBNTrtPg",
  authDomain: "whatsapp-clone-33ee3.firebaseapp.com",
  projectId: "whatsapp-clone-33ee3",
  storageBucket: "whatsapp-clone-33ee3.appspot.com",
  messagingSenderId: "3485402105",
  appId: "1:3485402105:web:a5eadc7402e95b335c3328",
  measurementId: "G-028V1NVEL1"
};


firebase.initializeApp(firebaseConfig);
export default firebase;

