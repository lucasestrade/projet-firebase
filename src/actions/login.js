import { auth } from '../firebase.js';

export const loginAction = (mail, password) => {
    console.log(mail);
    console.log(password);

    auth.createUserWithEmailAndPassword(mail, password)
      .then(user => {
        return page('/');
      }).catch(console.log);
}