'use strict';

const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class AboutPage extends React.Component {
    render() {

        return (
            <section className="section-about container">
                <Helmet>
                    <title>Thank You</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header">Thank You</h1>
                    <div className="media">
                        <div className="pull-left">
                            <div className="media-object">
                                <i className="fa fa-thumbs-o-up fa-4x"></i>
                            </div>
                        </div>
                        <div className="media-body">
                            <h4 className="media-heading">Thank you for signing up!</h4>
                            <p style={{ marginTop: '10px' }}>
                                Please check your <b>Inbox</b> for your unique verification link to activate your account.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = AboutPage;
