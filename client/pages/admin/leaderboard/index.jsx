'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');
const Store = require('./store');
const Results = require('./results.jsx');
const ClassNames = require('classnames');
const io = require('socket.io-client');
const Link = ReactRouter.Link;


let socket;

class Leaderboard extends React.Component {
    constructor(props) {

        super(props);

        Actions.retrieveTopTen("casual");

        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        // Connect to socket.io on the same hostname and port number from the server
        socket = io.connect(window.location.hostname + ':' + window.location.port);

        // Let's create our socket listener!
        socket.on('new_score', (res) => {

            const level = res.level;
            const arrayLength = this.state.leaderboard.data.length;

            // If the score is not higher than the lowest then don't bother
            if (arrayLength < 10) {

                Actions.insertScore(res);
            } else if (res.score > this.state.leaderboard.data[arrayLength - 1].score) {

                Actions.insertScore(res);
            }

        });
    }

    componentWillUnmount() {

        this.unsubscribeStore();

        socket.disconnect();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    activeCard(level) {

        // If it's the same level, ignore it
        if (this.state.leaderboard.difficulty === level) {
            return;
        }

        Actions.resetDifficulty(level);

        Actions.retrieveTopTen(level);
    }

    render() {

        const casualClass = ClassNames({
            'f' : true,
            'c1' : true,
            'active' : this.state.leaderboard.difficulty === 'casual'
        });
        const mediumClass = ClassNames({
            'f' : true,
            'c2' : true,
            'active' : this.state.leaderboard.difficulty === 'medium'
        });
        const hardClass = ClassNames({
            'f' : true,
            'c3' : true,
            'active' : this.state.leaderboard.difficulty === 'hard'
        });


        return (
            <section className="container">
                <div className="cards">
                    <div className="difficulty">

                        <div className="card" onClick={() => this.activeCard("casual")}>
                            <div className={casualClass}>
                                <div className="contentbox">Casual</div>
                            </div>
                        </div>

                        <div className="card" onClick={() => this.activeCard("medium")}>
                            <div className={mediumClass}>
                                <div className="contentbox">Medium</div>
                            </div>
                        </div>

                        <div className="card" onClick={() => this.activeCard("hard")}>
                                <div className={hardClass}>
                                    <div className="contentbox">Hard</div>
                                </div>
                        </div>
                    </div>
                </div>

                <Results difficulty={this.state.leaderboard.difficulty} data={this.state.leaderboard.data} />
            </section>
        );
    }
}

module.exports = Leaderboard;
