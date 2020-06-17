import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp(window.config);

export const database = firebase.database();
export const firestore = firebase.firestore();
export const auth = firebase.auth();