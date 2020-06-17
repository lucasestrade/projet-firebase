import { html, render } from "lit-html";

export default function createRestaurantsCards(restaurants){
    return (JSON.parse(restaurants)).map(restaurant => {
        return html`
            <button class="restaurant-card" data-id="${restaurant.id}">
                <div class="card flex column">
                    <div>
                        <p>${restaurant.name}</p>
                    </div>
                    <div>
                        <p>${restaurant.type}</p>
                    </div>
                    <div>
                        <p>${restaurant.adresse}</p>
                    </div>
                    <div>
                        <p>${restaurant.phone}</p>
                    </div>
                    <div>
                        <p>${restaurant.note}</p>
                    </div>
                </div>
            </button>
        `
    })
}