import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import database from "../../firebase/firebaseConfig"

export const sendMessage = (from, to, msg, type) => {
    let user = {
        name: from.displayName,
        email: from.email,
        uid: from.uid,
        photoURL: from.photoURL
      };
    addDoc(collection(database, `users/${to.uid}/messages`), {
        msg: msg,
        dateAdded: new Date().getTime(),
        from: {
            ...user
        },
        type: type
    });
}