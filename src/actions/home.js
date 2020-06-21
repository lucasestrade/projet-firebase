import { auth, firestore } from "../firebase";

export const loadHomeDatas = () => {
    let favs = [];
    let restaurants = [];
    firestore
    .collection('restaurants')
    .orderBy('note', 'desc')
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
        ref.docChanges().forEach(change => {
        const { newIndex, oldIndex, doc, type } = change;
        if (type === 'added') {
            let docData = doc.data();
            docData["id"] = doc.id;
            docData["fav"] = favs.includes(doc.id);
            restaurants = [ ...restaurants, docData ];
        } else if (type === 'removed') {
            restaurants.splice(oldIndex, 1);
        }
        });

        window.localStorage.setItem("restaurants", JSON.stringify(restaurants));
    });
}