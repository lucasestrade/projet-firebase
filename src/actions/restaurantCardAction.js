import { firestore, auth, storage } from "../firebase";
import page from 'page';
import providers from "../providers";
import localStorageAction from './localStorageAction';
import Popup from '../components/popup';

export const restaurantCardInViewportWhileScrolling = () => {
    window.addEventListener("scroll", function(){
        restaurantCardInViewport();
    })
}

export const restaurantCardInViewport = () => {
    let elements = document.getElementsByClassName("restaurant-card");
    Array.prototype.filter.call(elements, function(el){
      if(!el.dataset.isloaded){
        var rect = el.getBoundingClientRect();
        if(rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)){
          el.dataset.isloaded = true;
          let postalCode = el.dataset.postalcode;
          let name = el.dataset.name;
          storage.ref(`/restaurants/${postalCode}/${name}/background`).list()
              .then(function(res){
                res.items[0].getDownloadURL().then(function(url){
                  el.style.backgroundImage = `url(${url})`;
                })
              });
        }
      }
    })
}

export const cardEvent = (el = null) => {
    if(el === null){
        let cards = document.getElementsByClassName("restaurant-card");
        Array.prototype.forEach.call(cards, element => element.addEventListener("click", function(){
        page(`restaurant-${this.dataset.postalcode}-${this.dataset.name}-${this.dataset.id}`)
        }))
    }else{
        el.addEventListener("click", function(){
            page(`restaurant-${el.dataset.postalcode}-${el.dataset.name}-${el.dataset.id}`)
        });
    }
}

export const ctaFavAction = (favorites = false) => {
    Array.prototype.map.call(document.getElementsByClassName("cta-fav-card"), function(el){
        el.addEventListener("click", function(){
            switch(this.dataset.status){
                case "fav":
                itemFavStatus("fav", this);
                break;
                case "notFav":
                itemFavStatus("notFav", this);
                break;
                default: return;
            }
  
            function itemFavStatus(status, el){
                let uid = auth.currentUser.uid;
                let restId = el.dataset.id;
                if(navigator.onLine){
                    firestore.collection("favs")
                    .doc(uid)
                        .get().then(function(doc){
                        if(typeof doc.data() !== "undefined"){
                            let data = doc.data().fav;
                            if(status !== "fav"){
                                data.push(restId);
                                let uniqueDatas = new Set(data);
                                var newDatas = [...uniqueDatas];
                            }else{
                                let indexToRemove = data.indexOf(restId);
                                if(indexToRemove > -1){
                                    data.splice(indexToRemove, 1);
                                    var newDatas = data;
                                }
                            }
                    }else{
                        var newDatas = [restId];
                    }
    
                    firestore.collection('favs')
                        .doc(uid)
                            .set({"fav": newDatas})
                    });
                }else{
                    window.localStorage.setItem("syncro", false);
                }
                let favsLocalStorage = JSON.parse(window.localStorage.getItem("favs")) || [];
                if(status !== "fav"){
                    favsLocalStorage.push(restId);
                    let uniqueStorageFavs = new Set(favsLocalStorage);
                    let newStorageFavs = [...uniqueStorageFavs];
                    window.localStorage.setItem("favs", JSON.stringify(newStorageFavs));
                    localStorageAction("restaurants", restId, {
                        fav: true
                    });
                    el.dataset.status = "fav";
                    el.title = "Retirer des favoris";
                    el.children[0].children[0].children[0].setAttribute("d", providers.icons.FAV);
                    Popup.success("Le restaurant a été ajouté aux favoris avec succès");
                }else{
                    let indexToRemove = favsLocalStorage.indexOf(restId);
                    if(indexToRemove > -1){
                        favsLocalStorage.splice(indexToRemove, 1);
                        var newLocalStorageFavs = favsLocalStorage;
                        window.localStorage.setItem("favs", JSON.stringify(newLocalStorageFavs));
                        localStorageAction("restaurants", restId, {
                            fav: false
                        });
                    }
                    el.dataset.status = "notFav";
                    el.title = "Ajouter aux favoris";
                    el.children[0].children[0].children[0].setAttribute("d", providers.icons.NOT_FAV);
                    Popup.success("Le restaurant a été retiré des favoris avec succès");
                }
            }
            if(favorites){
                el.parentNode.remove();
            }
        })
    });
}