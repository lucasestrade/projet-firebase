import page from 'page';
import { auth } from './firebase.js';
/*import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';*/

const app = document.querySelector('#app .outlet');
const skeleton = document.querySelector('#app .skeleton');

/*firebase.initializeApp(window.config);
const database = firebase.database();
const firestore = firebase.firestore();
const auth = firebase.auth();*/

auth.onAuthStateChanged(user => {
  if (!user) {
    window.localStorage.setItem('logged', 'false');
    return console.log('logged out');
  }
  window.localStorage.setItem('logged', 'true');
  window.localStorage.setItem('userId', user.uid);
  document.dispatchEvent(new CustomEvent('user-logged', { detail: user }));
});

/*const notificationBtn = document.querySelector('#notification');
notificationBtn.addEventListener('click', () => {
  const result = confirm('Would you lie to receive push notification for more porn ?');
  if (result) {
    grantNotification();
  }
});

subcribeNotification();*/

page('/login', async () => {
  // Navigation guard
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState !== 'false') return page('/');

  const module = await import('./views/signIn.js');
  const SignIn = module.default;

  const ctn = app.querySelector('[page=signin]');
  const SignInView = new SignIn(ctn);

  displayPage('signin');
});

page('/', async () => {
  // Navigation guard
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState === 'false') return page('/login');

  const module = await import('./views/home.js');
  const Home = module.default;

  //subcribeNotification();

  const messages = [];

  const ctn = app.querySelector('[page=home]');
  const HomeView = new Home(ctn);

  document.addEventListener('send-message', ({ detail: message }) => {
    if (!message) return;
    // Using realtime database
    // database.ref().child('/messages').push({
    //   content: message,
    //   date: Date.now()
    // });

    // Using firestore
    /*firestore.collection('messages').add({
      content: message,
      date: Date.now(),
      user: {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email
      }
    });*/
  });

  displayPage('home');
});

page();

/*function scrollDown() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 0);
}*/

function displayPage(name) {
  const skeleton = document.querySelector('#app .skeleton');
  skeleton.removeAttribute('hidden');
  const pages = app.querySelectorAll('[page]');
  pages.forEach(page => page.removeAttribute('active'));
  skeleton.setAttribute('hidden', 'true');
  const p = app.querySelector(`[page="${name}"]`);
  p.setAttribute('active', true);
}

/*function grantNotification() {
  if (('serviceWorker' in navigator) || 'PushManager' in window) {
    Notification.requestPermission()
      .then(result => {
        if (result === 'denied') {
          console.log("Permission not granted");
        } else if (result === 'default') {
          console.log('Permission was dismissed');
        }

        console.log('Notification granted', result);
        subcribeNotification();
      })
  } else {
    console.log("Sorry, Web push notification aren't supported on your device :'(");
  }
}*/

/*function subcribeNotification() {
  const noficationRegistered = window.localStorage.getItem('noficationRegistered');
  if (Notification.permission === 'granted' && auth.currentUser && noficationRegistered !== 'true') {
    navigator.serviceWorker.ready
      .then(reg => {
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(window.config.publicKey)
        })
        .then(async subscription => {
          console.log(subscription);
          try {
            const result = await fetch(`${window.config.notificationBackend}/subscribe`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                subscription,
                user: auth.currentUser.uid,
                groupe: 'all'
              })
            });
            window.localStorage.setItem('noficationRegistered', 'true');
          } catch(err) {
            console.log(err);
          }
        })
      })
  }
}*/

/*function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}*/