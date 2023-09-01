import React, { useEffect, useState } from 'react'
import ProfilePage from './ProfilePage'
import { useParams } from 'react-router'
import { doc, getDoc } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'
import Loading from './Loading';

const ProfilePageOther = () => {
    let { id } = useParams();
    let [user, setUser] = useState();
    useEffect(() => {
        getDoc(doc(database, `users/${id}`))
        .then((snapshot) => {
            setUser({
                displayName: snapshot.data().name,
                ...snapshot.data()
            });
        })
    }, [id]);
    if(!user){
        return (
            <Loading />
        )
    }
    return (
        <ProfilePage user={user} />
    )
}

export default ProfilePageOther