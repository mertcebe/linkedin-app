import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loading from './Loading';
import Post from './Post';
import database from '../firebase/firebaseConfig'

const OnePost = () => {
    const { id } = useParams();
    let [post, setPost] = useState();
    useEffect(() => {
        getDoc(doc(database, `allPosts/${id}`))
            .then((snapshot) => {
                setPost({
                    ...snapshot.data(),
                    id: snapshot.id
                });
            });
    }, []);
    if (!post) {
        return (
            <Loading />
        )
    };
    return (
        <div style={{width: "500px"}}>
            <Post post={post}/>
        </div>
    )
}

export default OnePost