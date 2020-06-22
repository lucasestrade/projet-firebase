import { html, render } from "lit-html";
import { onPlateClick, submitNote, findRestaurant, generatePlateList } from "../actions/restaurantAction";
import stars, { calcNoteRound } from '../components/stars';
import { storage } from '../firebase';

export default class Restaurant {
  constructor(page, postalCode, name, id) {
    this.postalCode = postalCode;
    this.name = name,
    this.id = id;
    this.page = page;
    this.findRestaurant();
  }

  template() {
    return html`
      <div id="title-restaurant-block" class="img title-restaurant-block flex align-center" >
        <h1 class="title">${this.restaurant.name}</h1>
      </div>
      <div class="restaurant-block flex column">
        <div class="description">
          <h2>Description</h2>
          <p>
            ${this.restaurant.description}
          </p>
        </div>
        <div class="note">
          <h2>Note</h2>
          <div class="flex">
            <p class="flex align-center">
              ${calcNoteRound(this.restaurant.note)} / 5
              ${stars(this.restaurant.note)}
            </p>
            <form id="form-note" class="flex align-center">
              <div class="flex align-center">
                <label>
                  Donner une note :
                </label>
                <input id="note" type="number" value="1" min="1" max="5" style="text-align: right;"/>
                <label>
                  /5
                </label>
                <button type="submit" class="cta" >Noter</button>
              </div>
            </form>
          </div>
        </div>
        <div class="flex column">
          <div class="flex space-between align-center">
            <h2>Plats</h2>
            <div class="flex align-center" id="price-recap">
              <p id="total-price">
                Total : $0
              </p>
            </div>
          </div>
          ${generatePlateList(this.restaurant.food)}
        </div>
      </div>
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }

  async findRestaurant(){
    this.restaurant = await findRestaurant(this.id);
    this.renderView();
    this.renderBackground(this.postalCode, this.name);
    submitNote(this.id);
    onPlateClick();
  }

  renderBackground(postalCode, name){
    let block = document.getElementById("title-restaurant-block");
    if(navigator.onLine){
      storage.ref(`/restaurants/${postalCode}/${name}/background`).list()
        .then(function(res){
          res.items[0].getDownloadURL().then(function(url){
            block.style.backgroundImage = `url(${url})`;
            return url;
          })
        });
      }else{
        block.style.backgroundImage = `url(${this.restaurant.background_image})`;
      }
  }

  onclickValidateBasket(el){
    onclickValidateBasket(el);
  }

}