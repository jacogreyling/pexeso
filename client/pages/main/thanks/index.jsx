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
                    <div className="col-sm-6">
                        <h1 className="page-header">Thank You</h1>
                        <div className="media">
                            <div className="pull-left">
                                <div className="media-object">
                                    <i className="fa fa-thumbs-o-up fa-4x"></i>
                                </div>
                            </div>
                            <div className="media-body">
                                <h4 className="media-heading">Thank You For Signing Up</h4>
                                <p>
                                    Please Check your Inbox for your Verification Link. 
                                </p>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">GitHub</h1>
                        <p className="lead">
                            Fork&nbsp;
                            <a href="https://github.com/jacogreyling/pexeso"
                                style={{outline: '0'}} target="_blank">
                                this
                            </a>&nbsp;project on Github and help us build pexeso!
                        </p>
                        <img height="250" width="250" src="public/media/github.png"
                             alt="Fork this project on Github and help us build pexeso" />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = AboutPage;
