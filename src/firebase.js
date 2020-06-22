import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp(window.config);
firebase.firestore().enablePersistence();

export const storage = firebase.storage();
export const database = firebase.database();
export const firestore = firebase.firestore();
export const auth = firebase.auth();