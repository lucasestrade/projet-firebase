import { html, render } from "lit-html";
import createRestaurantsCards from '../components/restaurantCard.js';
import { loadHomeDatas } from "../actions/home.js";
import { ctaFavAction, cardEvent, restaurantCardInViewportWhileScrolling, restaurantCardInViewport } from "../actions/restaurantCardAction";
import { searchAction } from "../actions/searchAction";

export default class Home {
  constructor(page) {
    this.page = page;
    this.loadDatas();
    ctaFavAction();
    searchAction();
  }

  template() {
    return html`
      <div class="flex space-between align-center">
        <div>
          <h1 class="title">Nos Restaurants</h1>
        </div>
        <div class="relative"> 
          <input id="field-search-restaurant" class="field" type="text" placeholder="Rechercher un restaurant..." />
        </div>
      </div>
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
    let ctx = this;
    if(navigator.onLine){
      loadHomeDatas(function(){
        ctx.renderView();
        cardEvent();
        restaurantCardInViewportWhileScrolling();
        restaurantCardInViewport();
      });
      return;
    }

      this.renderView();
      cardEvent();
      restaurantCardInViewportWhileScrolling();
      restaurantCardInViewport();
  }
}