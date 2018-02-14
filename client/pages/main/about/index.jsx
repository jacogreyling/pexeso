'use strict';

const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class AboutPage extends React.Component {
    render() {

        return (
            <section className="section-about container">
                <Helmet>
                    <title>About Us</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header" style={{marginLeft: '15px', marginRight: '15px'}}>About Us</h1>
                    <div className="col-sm-12">
                        <h4 className="media-heading">
                            <p>
                                <b><i>Pexeso</i></b>, also known as <b>Match Match</b>, <b>Match Up</b>, <b>Memory</b>, <b>Pelmanism</b>, <b>Shinkei-suijaku</b>,&nbsp;
                                <b>Concentration</b> or simply <b>Pairs</b>, is a card game in which all of the cards are laid face down on a surface and 
                                two cards are flipped face up over each turn. The object of the game is to turn over pairs of matching cards.
                            </p>
                            <p>
                                Pexeso is the brainchild of two developers, <a href="https://www.linkedin.com/in/jaco-greyling/">Jaco Greyling</a> and&nbsp;
                                <a href="https://www.linkedin.com/in/charlklein/">Charl-Adrian Klein</a>. They created the 'game' as a way to showcase how technology
                                can accelerate the <i>Continuous Delivery</i> pipeline from idea to outcome. The objective of this project is not the game itself but rather
                                how to create a fully automated code deployment pipeline, in the real world.
                            </p>
                            <p>
                                The game is completely FREE and available on <a hreg="https://github.com/jacogreyling/pexeso">GitHub</a>.
                                Please support us by starring Pexeso <a href="https://github.com/jacogreyling/pexeso/star">here</a>.
                            </p>
                        </h4>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = AboutPage;
