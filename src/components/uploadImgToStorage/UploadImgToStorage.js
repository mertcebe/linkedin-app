import React from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const UploadImgToStorage = (file, to) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();

        const metadata = {
            contentType: file.type
        };
        const storageRef = ref(storage, `${to}/` + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file.self, metadata)
            .then((snapshot) => {
                let newFiles = [];
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve({
                        name: file.name,
                        src: downloadURL
                    });
                });
            })
    })

}