import React, { useEffect, useState } from 'react'
import Posts from './Posts'
import { collection, getDocs, query } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'

const Home = () => {
  return (
    <div className='container' style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ width: "20%", background: "lightblue" }}>My Account</div>
      <div style={{ width: "50%" }}><Posts /></div>
      <div style={{ width: "20%", background: "lightblue" }}>Recommend</div>
    </div>
  )
}

export default Home