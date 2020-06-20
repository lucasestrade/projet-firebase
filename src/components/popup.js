const Popup = {
    success : (message) => {
        createPopup("success", message);
        popUpAutoDestruct();
    },
    error : (message) => {
        createPopup("error", message);
        popUpAutoDestruct();
    }
}

function createPopup(type, message){
    let popupBlock = document.createElement("div");
    popupBlock.setAttribute("class", `popup ${type} flex align-center`);
    let p = document.createElement("p");
    p.innerText = message; 
    popupBlock.append(p);
    document.getElementsByTagName("body")[0].append(popupBlock);
}

function popUpAutoDestruct(){
    setTimeout(function(){
        let popup = document.getElementsByClassName("popup");
        Array.prototype.map.call(popup, function(el){
            el.remove();
        })
    }, 4000);
}

export default Popup;