((window) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBix8X-TmCY2tUOCIsUr7nxgT4d1cAQeOY",
    authDomain: "projetresto-6342d.firebaseapp.com",
    databaseURL: "https://projetresto-6342d.firebaseio.com",
    projectId: "projetresto-6342d",
    storageBucket: "projetresto-6342d.appspot.com",
    messagingSenderId: "664400399655",
    appId: "1:664400399655:web:849a720fb2e1f1e42dad02"
  };

  const config = {
    notificationBackend: "https://simple-push-notification.glitch.me",
    publicKey: "BB63_u6iY7TQHzSMpPDnxeTCqwfqkJvc51Ejnkfk4FlDCeMkamh-kfqCt8UfeT9e5OES5b7M2ijb2qA6hlZvhwc"
  };

  window.config = { ...firebaseConfig, ...config };
})(window);
