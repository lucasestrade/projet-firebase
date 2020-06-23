import { html, render } from "lit-html";
import { generateCommentariesList, onCommentaryFormSubmit, onPlateClick, submitNote, findRestaurant, generatePlateList } from "../actions/restaurantAction";
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
        <div class="open-days">
          <h2>Jours d'ouverture</h2>
          <p>De ${this.restaurant.start} à ${this.restaurant.end}</p>
          <p>Lundi : ${this.restaurant.days[0] ? "ouvert" : "fermé"}</p>
          <p>Mardi : ${this.restaurant.days[1] ? "ouvert" : "fermé"}</p>
          <p>Mercredi : ${this.restaurant.days[2] ? "ouvert" : "fermé"}</p>
          <p>Jeudi : ${this.restaurant.days[3] ? "ouvert" : "fermé"}</p>
          <p>Vendredi : ${this.restaurant.days[4] ? "ouvert" : "fermé"}</p>
          <p>Samedi : ${this.restaurant.days[5] ? "ouvert" : "fermé"}</p>
          <p>Dimanche : ${this.restaurant.days[6] ? "ouvert" : "fermé"}</p>
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
        <div class="commentaries">
          <h2>Commentaires</h2>
          <div class="flex column">
          <div id="write-commentary" class="write-commentary">
            ${generateCommentariesList(this.restaurant.commentaries)}
            <form id="form-write-commentary" data-id="${this.id}" class="form-write-commentary flex column">
              <textarea placeholder="Ecrire un commentaire..."></textarea>
              <button type="submit" class="cta" >Publier le commentaire</button>
            </form>
          </div>
          </div>
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
    onCommentaryFormSubmit();
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