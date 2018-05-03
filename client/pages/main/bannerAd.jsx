'use strict';

const React = require('react');

class BannerAd extends React.Component {
    render() {

        const URLArray = ['https://www.eoh.co.za',
            'https://www.eoh.co.za',
            'https://www.eoh.co.za',
            'https://www.ca.com',
            'https://www.ca.com'];

        const randomNum = (Math.floor(Math.random() * Math.floor(URLArray.length)));
        const pickedURL = URLArray[randomNum].toString();
        const mediaURl = "/public/media/ads/" + randomNum + ".jpg";

        return (
            <span className="banner">
                <a href={pickedURL} target="_blank" >
                    <img src={mediaURl} />
                </a>
            </span>
        );
    }
}


module.exports = BannerAd;
