import firebase from 'firebase/app';
import 'firebase/auth';

async function GetAuthToken() {
  if (firebase.auth().currentUser)
    return `Bearer ${await firebase.auth().currentUser.getIdToken(true)}`;
  else return "Bearer noauth";
}

export default GetAuthToken;
