import page from 'page';
import { auth, storage } from './firebase.js';
import providers from './providers.js';
import { syncro, changeConnectionStatus } from './actions/network';

const app = document.querySelector('#app .outlet');
const skeleton = document.querySelector('#app .skeleton');

if(navigator.onLine){
  changeConnectionStatus("online");
  syncro();
}else{
  changeConnectionStatus("offline");
}

window.addEventListener('online', () => {
  changeConnectionStatus("online");
  syncro();
});
window.addEventListener('offline', () => {
  changeConnectionStatus("offline");
});

auth.onAuthStateChanged(user => {
  if (!user) {
    return window.localStorage.setItem('logged', 'false');
  }
  window.localStorage.setItem('logged', 'true');
  window.localStorage.setItem('userId', user.uid);
  window.localStorage.setItem('profilePic', user.photoURL);
  document.dispatchEvent(new CustomEvent('user-logged', { detail: user }));
  document.getElementById("cta-profile").style.backgroundImage = `url(${window.localStorage.getItem('profilePic') !== "null" ? window.localStorage.getItem('profilePic') : providers.img.DEFAULT_PROFILE_PIC})`;
});

page('/login', async () => {
  // Navigation guard
  document.title = "Connexion";
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState !== 'false') return page('home');

  const module = await import('./views/signIn.js');
  const SignIn = module.default;

  const ctn = app.querySelector('[page=signin]');
  const SignInView = new SignIn(ctn);

  displayPage('signin');
});

page('/home', async () => {
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState === 'false') return page('/login');

  const module = await import('./views/home.js');
  const Home = module.default;

  const messages = [];

  const ctn = app.querySelector('[page=home]');
  const HomeView = new Home(ctn);

  displayPage('home');
});

page('/restaurant-:postalcode-:name-:id', async (req) => {
  // Navigation guard
  document.title = "Restaurant - " + req.params.name;
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState == 'false') return page('/login');

  const module = await import('./views/restaurant.js');
  const Restaurant = module.default;

  const ctn = app.querySelector('[page=restaurant]');
  const RestaurantView = new Restaurant(ctn, req.params.postalcode, req.params.name, req.params.id);

  displayPage('restaurant');
});

page('/favorites', async (req) => {
  // Navigation guard
  document.title = "Mes favoris";
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState == 'false') return page('/login');

  const module = await import('./views/favorites.js');
  const Favorites = module.default;

  const ctn = app.querySelector('[page=favorites]');
  const FavoritesView = new Favorites(ctn);

  displayPage('favorites');
});

page('/settings', async (req) => {
  // Navigation guard
  document.title = "Parametres";
  const loggedInState = window.localStorage.getItem('logged');
  if (loggedInState == 'false') return page('/login');

  const module = await import('./views/settings.js');
  const Settings = module.default;

  const ctn = app.querySelector('[page=settings]');
  const SettingsView = new Settings(ctn);

  displayPage('settings');
});

page();

function displayPage(name) {
  const skeleton = document.querySelector('#app .skeleton');
  skeleton.removeAttribute('hidden');
  const pages = app.querySelectorAll('[page]');
  pages.forEach(page => page.removeAttribute('active'));
  skeleton.setAttribute('hidden', 'true');
  const p = app.querySelector(`[page="${name}"]`);
  p.setAttribute('active', true);
}

document.getElementById("cta-profile").addEventListener("click", function(){
  page("settings");
});

document.getElementById("cta-home").addEventListener("click", function(){
  page("home");
});

document.getElementById("cta-favs").addEventListener("click", function(){
  page("favorites");
});

document.getElementById("cta-logout").addEventListener("click", function(){
  auth.signOut().then(function(){
    page("login");
  });
});









const notificationBtn = document.querySelector('#cta-notifs');
notificationBtn.addEventListener('click', () => {
  const result = confirm('Souhaitez vous recevoir les notifications pour ce site ?');
  if (result) {
    grantNotification();
  }
});

subcribeNotification();

function grantNotification() {
  if (('serviceWorker' in navigator) || 'PushManager' in window) {
    Notification.requestPermission()
      .then(result => {
        subcribeNotification();
      })
  } else {
    console.log("Sorry, Web push notification aren't supported on your device :'(");
  }
}

function subcribeNotification() {
  const noficationRegistered = window.localStorage.getItem('noficationRegistered');
  if (Notification.permission === 'granted' && auth.currentUser && noficationRegistered !== 'true') {
    navigator.serviceWorker.ready
      .then(reg => {
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(window.config.publicKey)
        })
        .then(async subscription => {
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
}

function urlBase64ToUint8Array(base64String) {
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
}