import React from 'react'
import axios from 'axios'

const SearchPage = () => {
    let data = JSON.stringify({
        "q": "javaScript"
    });
    let config = {
        method: 'post',
        url: 'https://google.serper.dev/search',
        headers: {
            'X-API-KEY': '8e9e005f6073a3848994e8594c5294ef12c8d491',
            'Content-Type': 'application/json'
        },
        data: data
    };
    // axios(config)
    //     .then((response) => {
    //         console.log(response.data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    return (
        <div>SearchPage</div>
    )
}

export default SearchPage