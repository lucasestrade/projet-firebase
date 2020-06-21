import { html, render } from "lit-html";
import createRestaurantsCards from '../components/restaurantCard.js';
import { ctaFavAction, cardEvent, restaurantCardInViewportWhileScrolling, restaurantCardInViewport } from "../actions/restaurantCardAction";
import { searchAction } from "../actions/searchAction";

export default class Favorites {
  constructor(page) {
    this.page = page;
    //this.loadDatas();
    //ctaFavAction();
    this.renderView();
    cardEvent();
    restaurantCardInViewportWhileScrolling();
    restaurantCardInViewport();
    ctaFavAction(true);
    searchAction();
  }

  template() {
    return html`
        <div class="flex space-between align-center">
            <div>
                <h1 class="title">Mes restaurants favoris</h1>
            </div>
            <div class="relative"> 
                <input id="field-search-restaurant" class="field" type="text" placeholder="Rechercher un restaurant..." />
            </div>
        </div>
      <div class="restaurants-list flex">
        ${createRestaurantsCards(window.localStorage.getItem("restaurants"), true)}
      </div>
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }

  /*loadDatas(){
    if(navigator.onLine){
      loadHomeDatas();
    }
    this.renderView();
    this.cardEvent();
    restaurantCardInViewportWhileScrolling();
    restaurantCardInViewport();
  }*/
}