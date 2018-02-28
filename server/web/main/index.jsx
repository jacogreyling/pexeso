'use strict';

const PropTypes = require('prop-types');
const React = require('react');


const propTypes = {
    markup: PropTypes.node,
    helmet: PropTypes.object,
    state: PropTypes.object
};


class MainPage extends React.Component {
    render() {

        return (
            <html>
                <head>
                    {this.props.helmet.title.toComponent()}
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    {this.props.helmet.meta.toComponent()}
                    <script type="text/javascript" id="ca_eum_ba" agent="browser" src="https://cloud.ca.com/mdo/v1/sdks/browser/BA.js" data-profileurl="https://collector-axa.cloud.ca.com//api/1/urn:ca:tenantId:C9DAE40F-4E4E-4DC8-AF2F-72B99D7678A4/urn:ca:appId:Pexeso/profile?agent=browser" data-tenantid="C9DAE40F-4E4E-4DC8-AF2F-72B99D7678A4" data-appid="Pexeso" data-appkey="433462d0-1bb4-11e8-997b-355b7998e53c"></script>
                    <link rel="stylesheet" href="/public/core.min.css" />
                    <link rel="stylesheet" href="/public/pages/main.min.css" />
                    <link rel="shortcut icon" href="/public/media/favicon.ico" />
                    {this.props.helmet.link.toComponent()}
                </head>
                <body>
                    <div id="app-mount"
                        dangerouslySetInnerHTML={{
                            __html: this.props.markup
                        }}
                    />
                    <script id="app-state"
                        dangerouslySetInnerHTML={{
                            __html: this.props.state
                        }}
                    />
                    <script src="/public/core.min.js"></script>
                    <script src="/public/pages/main.min.js"></script>
                </body>
            </html>
        );
    }
}


MainPage.propTypes = propTypes;


module.exports = MainPage;
