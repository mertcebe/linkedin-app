import React, { useEffect, useState } from 'react'
import Posts from './Posts'
import { collection, getDocs, query } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'
import JobPosts from './JobPosts';

const Home = () => {
  return (
    <div className='container home'>
      <div className='myAccountSec'>My Account</div>
      <div className='postsSec'><Posts /></div>
      <div className='jobPosts'><JobPosts /></div>
    </div>
  )
}

export default Home