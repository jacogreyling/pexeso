'use strict';

const React = require('react');


class Footer extends React.Component {
    render() {

        const year = new Date().getFullYear();

        return (
            <div className="footer">
                <div className="container">
                    <div class="row">
                        <div class="col-sm-8">
                        </div>
                        <div class="col-sm-4">
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
