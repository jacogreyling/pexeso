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
                    <div className="col-sm-6">
                        <h1 className="page-header">Thank You!</h1>
                        <div className="media">
                            <div className="media-body">
                                <h4 className="media-heading">Please check your Inbox for your unique <b>verification</b> link to activate your account</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">Email</h1>
                        <p className="lead">
                            There is a surprise waiting for you, in your inbox.
                        </p>
                        <i className="fa fa-envelope-open-o bamf"></i>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = AboutPage;
