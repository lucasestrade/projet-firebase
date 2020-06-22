import { firestore } from "../firebase";
import Popup from "../components/popup";
import { html } from 'lit-html';

export function findRestaurant(id){
    if(navigator.onLine){
        return firestore.collection("restaurants")
            .doc(id)
                .get().then(async function(doc){
                    let docData = doc.data();
                    await firestore
                        .collection('notes')
                            .doc(id)
                                .get()
                                    .then(function(doc){
                                        docData["note"] = doc.data().notes;
                                    })
                    return docData;
                });
    }else{
        let restaurants = JSON.parse(window.localStorage.getItem("restaurants"));
        for(let restaurant of restaurants){
            if(restaurant.id === id){
                return restaurant;
            }
        }
    }
}

export function submitNote(restaurantId){
    document.getElementById("form-note").addEventListener("submit", function (event){
        event.preventDefault();
        let value = document.getElementById("note").value;

        if(navigator.onLine){
            firestore.collection("notes")
            .doc(restaurantId)
                .get().then(function(doc){
                    if(typeof doc.data() !== "undefined"){
                        let data = doc.data().notes;
                        data.push(parseInt(value));
                        var newDatas = data;
                    }else{
                        var newDatas = [parseInt(value)];
                    }

                    firestore.collection('notes')
                        .doc(restaurantId)
                            .set({"notes": newDatas})
            });
        }else{
            window.localStorage.setItem("syncro", false);
        }

        Popup.success("Le restaurant a été noté avec succès");
    })
}

export function generatePlateList(plateList){
    let array = Object.values(plateList);
    let i = 0;
    return array.map(plate => {
        ++i;
        return html`
            <div class="block-plate flex align-center" style="background-color:${i % 2 ? "#e6e6e6" : "#cccccc"};">
                <div class="checkbox-plate">
                    <input type="checkbox" class="cta-checkbox-plate"
                    data-name="${plate.name}"
                    data-description="${plate.description}"
                    data-price="${plate.prix}"
                    data-selected="false"
                    />
                </div>
                <div class="plate-name">
                    <p>
                        ${plate.name}
                    </p>
                </div>
                <div class="plate-description">
                    <p>
                        ${plate.description}
                    </p>
                </div>
                <div class="plate-price">
                    <p>
                        $${plate.prix}
                    </p>
                </div>
            </div>
        `
    });
}

let finalPrice = 0;
let listPlates = [];
export function onPlateClick(){
    let plates = document.getElementsByClassName("cta-checkbox-plate");
    Array.prototype.map.call(plates, function(el){
        el.addEventListener("click", function(){
            let name = this.dataset.name;
            let description = this.dataset.description;
            let price = this.dataset.price;
            let object = {
                name: name,
                description: description,
                price: price
            }
            if(el.dataset.selected === "false"){
                listPlates.push(object);
                finalPrice += parseInt(price);
                el.setAttribute("data-selected", "true");
            }else{
                let index = listPlates.findIndex(x => x.name === object.name);
                if (index > -1) {
                    listPlates.splice(index, 1);
                    finalPrice -= parseInt(price);
                    el.setAttribute("data-selected", "false");
                }
            }

            let ctaValidateBasket = document.getElementById("cta-validate-basket");
            if(listPlates.length !== 0 && !ctaValidateBasket){
                let parent = document.getElementById("price-recap");
                let button = document.createElement("button");
                button.setAttribute("id", "cta-validate-basket");
                button.setAttribute("class", "cta");
                button.setAttribute("onClick", "onclickValidateBasket(this)");
                button.innerText = "Valider le panier";

                parent.prepend(button);
            }else if(listPlates.length === 0){
                ctaValidateBasket.remove();
            }

            document.getElementById("total-price").innerText = "Total : $" + finalPrice;
        })
    })
}

window.onclickValidateBasket = function(el){
    let blockFilter = document.createElement("div");
    blockFilter.setAttribute("class", "block-paiement-filter flex align-center justify-center");
    blockFilter.setAttribute("id", "block-paiement-filter");

    let block = document.createElement("div");
    block.setAttribute("class", "block-paiement flex column");

    let close = document.createElement("input");
    close.value = "Fermer";
    close.id = "close-paiement"
    close.type = "button";
    block.append(close);

    let blockAdresse = document.createElement("div");
    blockAdresse.setAttribute("class", "block-adresse flex column");
    let adresseTitle = document.createElement("h2");
    adresseTitle.innerText = "Adresse de livraison";

    let input1 = document.createElement("input");
    input1.setAttribute("placeholder", "Adresse");
    input1.setAttribute("type", "text");

    let input2 = document.createElement("input");
    input2.setAttribute("placeholder", "Code postal");
    input2.setAttribute("type", "number");
    input2.setAttribute("max", "99999");
    input2.setAttribute("min", "0");

    let input3 = document.createElement("input");
    input3.setAttribute("placeholder", "Ville");
    input3.setAttribute("type", "text");

    blockAdresse.append(adresseTitle);
    blockAdresse.append(input1);
    blockAdresse.append(input2);
    blockAdresse.append(input3);

    block.append(blockAdresse);

    let blockCard = document.createElement("div");
    blockCard.setAttribute("class", "block-card flex column");
    let cardTitle = document.createElement("h2");
    cardTitle.innerText = "Paiement";

    let input4 = document.createElement("input");
    input4.setAttribute("placeholder", "Nom indiqué sur la carte");
    input4.setAttribute("type", "text");

    let input5 = document.createElement("input");
    input5.setAttribute("placeholder", "Numéro de carte");
    input5.setAttribute("type", "number");

    let input6 = document.createElement("input");
    input6.setAttribute("placeholder", "Date d'expiration de la carte");
    input6.setAttribute("type", "date");

    let input7 = document.createElement("input");
    input7.setAttribute("placeholder", "CVV");
    input7.setAttribute("type", "number");
    input7.setAttribute("max", "999");
    input7.setAttribute("min", "0");

    blockCard.append(cardTitle);
    blockCard.append(input4);
    blockCard.append(input5);
    blockCard.append(input6);
    blockCard.append(input7);

    block.append(blockCard);

    let submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "submit-paiement");
    submit.setAttribute("class", "cta");

    block.append(submit);

    blockFilter.append(block);
    document.getElementsByTagName("body")[0].append(blockFilter);

    onCloseClick(close);
    onsubmit(submit);
}

function onCloseClick(el){
    el.addEventListener("click", function(e){
        e.preventDefault();
        let parent = el.parentNode;
        parent.parentNode.remove();
    })
}

function onsubmit(el){
    el.addEventListener("click", function(e){
        e.preventDefault();
        let parent = el.parentNode;
        parent.parentNode.remove();
        Popup.success("Votre commande a bien été prise en compte");
    })
}