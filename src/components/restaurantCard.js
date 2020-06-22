import { html } from "lit-html";
import providers from '../providers.js';
import stars from '../components/stars';

export default function createRestaurantsCards(restaurants, favorites = false){
    return (JSON.parse(restaurants)).map(restaurant => {
        if((favorites && restaurant.fav) || !favorites){
            return html`
                <div class="block-restaurant-card flex column">
                    <button title="${ restaurant.fav ? "Retirer des favoris" : "Ajouter aux favoris"}" 
                    data-status="${restaurant.fav ? "fav" : "notFav"}" 
                    class="scale-1-1 cta-fav-card" 
                    data-id="${restaurant.id}" >
                        <svg version="1.0"
                            class="icon-fav-card"
                            viewBox="0 0 1280.000000 1189.000000"
                            preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,1189.000000) scale(0.100000,-0.100000)">
                                <path d="${ restaurant.fav ? providers.icons.FAV : providers.icons.NOT_FAV}"/>
                            </g>
                        </svg>
                    </button>
                    <button title="${restaurant.name}" 
                    class="restaurant-card" 
                    data-postalcode="${restaurant.postal_code}" 
                    data-name="${restaurant.name}"
                    data-id="${restaurant.id}"
                    style="background-image:url(${restaurant.background_image});">
                        <div class="card flex column">
                            <div>
                                <h1>${restaurant.name}</h1>
                            </div>
                            <div>
                                <p>${restaurant.type}</p>
                            </div>
                            <div>
                                <p>${restaurant.adresse}</p>
                            </div>
                            <div>
                                <p>${restaurant.postal_code}, ${restaurant.city}</p>
                            </div>
                            <div>
                                <p>${restaurant.phone}</p>
                            </div>
                            <div class="flex justify-center">
                                ${stars(restaurant.note)}
                            </div>
                        </div>
                    </button>
                </div>
            `
        }else{
            return null;
        }
    })
}