import React from 'react'
import Posts from './Posts'

const Home = () => {
  return (
    <div className='container' style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
      <div style={{width: "20%", background: "lightblue"}}>My Account</div>
      <div style={{width: "50%", background: "yellow"}}><Posts /></div>
      <div style={{width: "20%", background: "lightblue"}}>Recommend</div>
    </div>
  )
}

export default Home