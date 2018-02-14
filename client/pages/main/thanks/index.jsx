'use strict';

const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class AboutPage extends React.Component {
    render() {

        return (
            <section className="section container">
                <Helmet>
                    <title>Thank You</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header" style={{marginLeft: '15px', marginRight: '15px'}}>Thank You!</h1>
                    <div className="col-sm-12">
                        <div className="media">
                            <div className="media-body">
                                <h4 className="media-heading">Please check your Inbox for your unique <b>verification</b> link to activate your account</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = AboutPage;
