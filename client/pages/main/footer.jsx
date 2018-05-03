'use strict';

const React = require('react');
const BannerAd = require('./bannerAd.jsx');

class Footer extends React.Component {
    render() {

        const year = new Date().getFullYear();

        return (
            <div className="footer">
                <div className="container">
                    <div class="row">
                        <div class="col-sm-3">
                        </div>
                        <div class="col-sm-6">
                            <BannerAd />
                        </div>
                        <div class="col-sm-3">
                            <span className="copyright pull-right">
                                &#169; {year} CA Southern Africa
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = Footer;
