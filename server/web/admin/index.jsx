'use strict';

const React = require('react');
const PropTypes = require('prop-types');


const propTypes = {
    roles: PropTypes.string,
    user: PropTypes.string
};


class AdminPage extends React.Component {
    render() {

        return (
            <html>
                <head>
                    <title>Admin</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="pexeso-roles" content={this.props.roles} />
                    <meta name="pexeso-user" content={this.props.user} />
                    <script type="text/javascript" id="ca_eum_ba" agent="browser" src="https://cloud.ca.com/mdo/v1/sdks/browser/BA.js" data-profileurl="https://collector-axa.cloud.ca.com//api/1/urn:ca:tenantId:C9DAE40F-4E4E-4DC8-AF2F-72B99D7678A4/urn:ca:appId:Pexeso/profile?agent=browser" data-tenantid="C9DAE40F-4E4E-4DC8-AF2F-72B99D7678A4" data-appid="Pexeso" data-appkey="433462d0-1bb4-11e8-997b-355b7998e53c"></script>
                    <link rel="stylesheet" href="/public/core.min.css" />
                    <link rel="stylesheet" href="/public/pages/admin.min.css" />
                    <link rel="shortcut icon" href="/public/media/favicon.ico" />
                </head>
                <body>
                    <div id="app-mount"></div>
                    <script src="/public/core.min.js"></script>
                    <script src="/public/pages/admin.min.js"></script>
                </body>
            </html>
        );
    }
}


AdminPage.propTypes = propTypes;


module.exports = AdminPage;
