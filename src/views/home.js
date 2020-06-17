import { html, render } from "lit-html";
import { firestore } from '../firebase.js';
import createRestaurantsCards from '../components/restaurantCard.js';
import page from 'page';

export default class Home {
  constructor(page) {
    this.page = page;
    this.renderView();
    this.data = [];
    this.cardEvent();
  }

  template() {
    return html`
      <div class="restaurants-list flex">
        ${createRestaurantsCards(window.localStorage.getItem("restaurants"))}
      </div>
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);

    if(navigator.onLine){
      firestore
        .collection('restaurants')
        .orderBy('note', 'desc')
        .onSnapshot(ref => {
          ref.docChanges().forEach(change => {
            const { newIndex, oldIndex, doc, type } = change;
            if (type === 'added') {
              console.log(doc.data());
              let docData = doc.data();
              docData["id"] = doc.id;
              this.data = [ ...this.data, docData ];
            } else if (type === 'removed') {
              this.data.splice(oldIndex, 1);
            }
          });

          window.localStorage.setItem("restaurants", JSON.stringify(this.data))
        });
      }
  }

  cardEvent(){
    let cards = document.getElementsByClassName("restaurant-card");
    Array.prototype.forEach.call(cards, element => element.addEventListener("click", function(){
      page(`restaurant-${this.dataset.id}`)
    }))
  }
}