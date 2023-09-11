import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import database, { auth } from '../../firebase/firebaseConfig';
import Loading from '../Loading';
import Message from './Message';

const Messages = () => {
    let [messages, setMessages] = useState();
    useEffect(() => {
        getDocs(query(collection(database, `users/${auth.currentUser.uid}/messages`), orderBy('dateAdded', 'desc')))
        .then((snapshot) => {
            console.log(snapshot.size)
            let messages = [];
            snapshot.forEach((msg) => {
                messages.push({
                    ...msg.data(),
                    id: msg.id
                });
            })
            setMessages(messages);
        })
    }, []);

    if(!messages){
        return (
            <Loading />
        )
    }
    return (
        <div className='container my-3'>
            {
                messages.map((msg) => {
                    return (
                        <Message message={msg} key={msg.id}/>
                    )
                })
            }
        </div>
    )
}

export default Messages