import { auth, firestore } from "../firebase";

export function changeConnectionStatus(status){
    let elConnectionStatus = document.getElementById("circle-connection-state");
    let text = elConnectionStatus.firstElementChild;
    if(status === "online"){
      elConnectionStatus.classList.remove("offline");
      elConnectionStatus.classList.add("online");
      text.textContent = "ONLINE";
    }else{
      elConnectionStatus.classList.remove("online");
      elConnectionStatus.classList.add("offline");
      text.textContent = "OFFLINE";
    }
}

export function syncro(){
    if(window.localStorage.getItem("syncro") == "false"){
        favNotSync();
        commentariesNotSync();
    }

    window.localStorage.setItem("syncro", true);
}

function favNotSync(){
    let uid = auth.currentUser.uid;
    let favs = JSON.parse(window.localStorage.getItem("favs"));
    firestore.collection("favs")
        .doc(uid)
            .get().then(function(doc){
                if(typeof doc.data() !== "undefined"){
                    let data = doc.data().fav;
                    data.push(...favs);
                    let uniqueDatas = new Set(data);
                    var newDatas = [...uniqueDatas];
                }else{
                    var newDatas = [...favs];
                }

                firestore.collection('favs')
                    .doc(uid)
                        .set({"fav": newDatas})
            });
}

function commentariesNotSync(){
    console.log("aa");
    let commentaries = JSON.parse(window.localStorage.getItem("commentaries"));
    if(commentaries){
        for(let [key, value] of Object.entries(commentaries)){
            let uid = window.localStorage.getItem("userId");
            console.log(value);
            console.log(uid);
            console.log(commentaries);
            let firestoreDoc = firestore.collection('commentaries')
                .doc(key);
                firestoreDoc
                    .get()
                        .then(function(doc){
                            let data = doc.data();
                            if(data && data[uid]){
                                console.log(value);
                                value.map(d => {
                                    data[uid].push({
                                        value : d.value,
                                        date : d.date
                                    });
                                })
                                firestoreDoc
                                    .set(data);
                            }else{
                                firestoreDoc
                                    .set({...data,
                                        [uid] : commentaries[key]
                                    })
                            }
                        })
        }
        window.localStorage.removeItem("commentaries");
    }
}