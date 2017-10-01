'use strict';

const React = require('react');


class Footer extends React.Component {
    render() {

        const year = new Date().getFullYear();

        return (
            <div className="footer">
                <div className="container">
                    <span className="copyright pull-right">
                        &#169; {year} CA Southern Africa
                    </span>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}


module.exports = Footer;
