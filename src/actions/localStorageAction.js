export default function localStorageAction(key, target, modifs){
    switch(key){
        case "restaurants":
            updateRestaurants(target, modifs);
            break;
        default: return;
    }
}

function updateRestaurants(target, modifs){
    let restaurants = window.localStorage.getItem("restaurants");
    let parsedRestaurants = JSON.parse(restaurants);
    parsedRestaurants.map(async restaurant => {
        if(restaurant.id === target){
            let newObject = {...restaurant, ...modifs};
            for(let i = 0; i < parsedRestaurants.length; i++){
                if(parsedRestaurants[i] === restaurant){
                    if(i !== 0){
                        parsedRestaurants.splice(i, i);
                    }else{
                        parsedRestaurants.shift();
                    }
                    window.localStorage.setItem("restaurants", JSON.stringify([...parsedRestaurants, newObject]));
                }
            }
            return;
        }
    })
}