import { html, render } from "lit-html";
import { storage, firestore } from '../firebase.js';
import createRestaurantsCards from '../components/restaurantCard.js';
import page from 'page';

export default class Home {
  constructor(page) {
    this.page = page;
    this.loadDatas();
    this.data = [];
  }

  template() {
    return html`
      <h1 class="title">Nos Restaurants</h1>
      <div class="restaurants-list flex">
        ${createRestaurantsCards(window.localStorage.getItem("restaurants"))}
      </div>
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }

  loadDatas(){
    if(navigator.onLine){
      firestore
        .collection('restaurants')
        .orderBy('note', 'desc')
        .onSnapshot(ref => {
          ref.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change;
            if (type === 'added') {
              let docData = doc.data();
              docData["id"] = doc.id;
              this.data = [ ...this.data, docData ];
            } else if (type === 'removed') {
              this.data.splice(oldIndex, 1);
            }
          });

          window.localStorage.setItem("restaurants", JSON.stringify(this.data));
          this.renderView();
          this.cardEvent();
          this.restaurantCardInViewportWhileScrolling();
          this.restaurantCardInViewport();
        });
      }
    }

  cardEvent(){
    let cards = document.getElementsByClassName("restaurant-card");
    Array.prototype.forEach.call(cards, element => element.addEventListener("click", function(){
      page(`restaurant-${this.dataset.postalcode}-${this.dataset.name}`)
    }))
  }

  restaurantCardInViewportWhileScrolling(){
    let ctx = this;
    window.addEventListener("scroll", function(){
      ctx.restaurantCardInViewport();
    })
  }

  restaurantCardInViewport() {
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
    /*var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document. documentElement.clientWidth)
    );*/
  }

}