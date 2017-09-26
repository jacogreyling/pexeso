'use strict';

const React = require('react');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');

const Helmet = ReactHelmet.Helmet;
const Link = ReactRouter.Link;


class HomePage extends React.Component {

    constructor(props) {

        super(props);

    }

    render() {

        return (
            <section className="section-home container" onClick={() => (void(0))}>
                <Helmet>
                    <title>Pexeso - A memory card game that will test your wits!</title>
                </Helmet>
                <div className="home">
                    <div className="logo">

                        <div className="card">
                            <div className="flipper">
                                <div className="f c1">p</div>
                                <div className="b contentbox levels">
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="card twist active">
                            <div className="flipper">
                                <div className="b f">
                                    <div className="c2">e</div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flipper">
                                <div className="f c3">x</div>
                                <div className="b contentbox levels">
                                    <Link to="/signup">
                                        Sign-up
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="card twist active">
                            <div className="flipper">
                                <div className="b f">
                                    <div className="c4">e</div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flipper">
                                <div className="f c5">s</div>
                                <div className="b contentbox levels">
                                    <Link to="/about">
                                        About
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flipper">
                                <div className="f c6">o</div>
                                <div className="b contentbox levels">
                                    <Link to="/contact">
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
