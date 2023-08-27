import React from 'react'
import loadingGif from '../images/loading-gif-png.gif';

const Loading = () => {
  return (
    <div style={{textAlign: "center", margin: "10px 0"}}>
        <img src={loadingGif} alt="" style={{width: "30px"}} />
    </div>
  )
}

export default Loading