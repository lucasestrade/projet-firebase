import { html, render } from "lit-html";
import { auth, storage } from '../firebase.js';
import Popup from '../components/popup';

export default class Settings {
  constructor(page) {
    this.page = page;
    this.renderView();
  }

  template() {
    return html`
        <h1 class="title">Paramètres</h1>
        <div class="block-upload-profile-pic flex justify-center">
            <div class="upload-btn-wrapper">
                <button class="upload-btn flex column align-center justify-center">
                    <label>Sélectionner une image de profil</label>
                </button>
                <input type="file" id="input-file" accept="image/*" name="profile-pic" @change="${this.onImageChange}" />
            </div>
            <div class="flex column">
                <p>Taille max de l'image : 3 Mo</p>
                <p>Formats autorisés : JPEG | PNG | WEBP</p>
            </div>
        </div>
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }

  onImageChange(){
    let file = this.files[0];
    if(file !== undefined){
        let isSizeOk = this.files[0].size <= 3000000;

        if(isSizeOk){
            var base64;
            let blob = this.files[0];
            let fileReader = new FileReader();
            let fileReaderForBase64 = new FileReader();

            fileReaderForBase64.addEventListener("load", function(e){
                base64 = e.target.result;
            });
            fileReaderForBase64.readAsDataURL(blob);

            fileReader.onloadend = function(e) {
                let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                let header = "";
                for(let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }

                let type;
                switch (header) {
                    case "89504e47":
                        type = "image/png";
                        break;
                    case "52494646":
                        type = "image/webp";
                        break;
                    case "ffd8ffe0":
                    case "ffd8ffe1":
                    case "ffd8ffe2":
                    case "ffd8ffe3":
                    case "ffd8ffe8":
                        type = "image/jpeg";
                        break;
                    default:
                        type = "invalid";
                        break;
                }

                if(type !== "invalid"){
                    auth.onAuthStateChanged(async function(user){
                        let uid = user.uid;
                        var storageRef = storage.ref(uid + '/profilePicture/' + file.name);
                        storageRef.put(file).then(function(snapshot){
                            snapshot.ref.getDownloadURL().then(function(downloadUrl) {
                                document.getElementById("cta-profile").style.backgroundImage = `url(${downloadUrl})`;
                                user.updateProfile({
                                    photoURL : downloadUrl
                                });
                                window.localStorage.setItem('profilePic', user.photoURL);
                                Popup.success("L'image de profil à été modifiée avec succès");
                            })
                        });
                    });

                    /*var storageRef = storage.ref('/restaurants/92710/Au bon Oxenfurt/background/' + file.name);
                        storageRef.put(file)*/
                }else{
                    Popup.error("L'image est invalide");
                }
            };

            fileReader.readAsArrayBuffer(blob);
        }else{
            Popup.error("L'image doit avoir une taille de 3 Mo maximum'");
        }
    }
  }
}