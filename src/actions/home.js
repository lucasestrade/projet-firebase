import { auth, firestore } from "../firebase";

export const loadHomeDatas = (callback) => {
    let favs = [];
    let restaurants = [];
    firestore
        .collection('restaurants')
            .onSnapshot(async ref => {
                await firestore
                    .collection('favs').doc(auth.currentUser.uid)
                        .get()
                            .then(function(doc){
                                if(typeof doc.data() !== "undefined"){
                                    favs = doc.data().fav;
                                    window.localStorage.setItem("favs", JSON.stringify(favs));
                                }
                            });
                ref.docChanges().forEach(async change => {
                    const { newIndex, oldIndex, doc, type } = change;
                    let docData = doc.data();
                    let id = doc.id;
                    await firestore
                        .collection('notes')
                            .doc(id)
                                .get()
                                    .then(function(doc){
                                        docData["note"] = doc.data().notes;
                                    })
                    await firestore
                        .collection('commentaries')
                            .doc(id)
                                .get()
                                    .then(function(doc){
                                        if(doc.data()){
                                            docData["commentaries"] = doc.data();
                                        }else{
                                            docData["commentaries"] = {};
                                        }
                                    })
                    if (type === 'added') {
                        docData["id"] = doc.id;
                        docData["fav"] = favs.includes(doc.id);
                        restaurants = [ ...restaurants, docData ];
                    } else if (type === 'removed') {
                        restaurants.splice(oldIndex, 1);
                    }

                    window.localStorage.setItem("restaurants", JSON.stringify(restaurants));
                });
            });

            callback();
}