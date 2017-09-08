'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const Cards = require('./cards.jsx');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


const propTypes = {
    active: PropTypes.bool,
    cardSize: PropTypes.number,
    cards: PropTypes.array,
    flips: PropTypes.object,
    guess1: PropTypes.number,
    guess2: PropTypes.number,
    hydrated: PropTypes.bool,
    level: PropTypes.string,
    pairsToMatch: PropTypes.number,
    round: PropTypes.number,
    status: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date)
};


class Board extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            status: props.status
        }

    }

    componentWillReceiveProps(nextProps) {

        // This means we've finished the game, so lets update the statistics (hydrate)
        if (nextProps.status === "won" && !nextProps.hydrated) {

            // Update the statistics
            Actions.updateStats({
                status: nextProps.status,
                level: nextProps.level,
                flips: nextProps.flips,
                timestamp: nextProps.timestamp
            });

            // We've finished with the game and updated the statistics
            Actions.changeLogo("nice");
            Actions.gameStatisticsSaved();
        }

        this.setState({
            status: nextProps.status
        });
    }

    onAnimationEnd() {

        const status = "lost";

        // Update the statistics
        Actions.updateStats({
            status: status,
            level: this.props.level,
            flips: this.props.flips,
            timestamp: this.props.timestamp
        });

        // We've finished with the game and updated the statistics
        Actions.changeLogo("fail");
        Actions.endGameAndUpdateStatus(status);
    }

    onKeyPress(e) {

        const status = "abandoned";

        // If Escape is pressed
        if(e.keyCode === 27) {

            // Update the statistics
            Actions.updateStats({
                status: status,
                level: this.props.level,
                flips: this.props.flips,
                timestamp: this.props.timestamp
            });

            // We've finished with the game and updated the statistics
            Actions.changeLogo("stop");
            Actions.endGameAndUpdateStatus(status);
        }
    }

    render() {

        if (!this.props.active) {
            return null;
        }

        return (
            <div id="g" className={this.props.level} onKeyDown={(e) => this.onKeyPress(e)} tabIndex="0">
                <Helmet>
                    <title>Play</title>
                </Helmet>
                <div className="timer" ref="timer">
                    <span className="bar-unfill">
                        <span onAnimationEnd={() => this.onAnimationEnd()} className="bar-fill" style={{animation: '90000ms linear 0s normal none 1 running timer'}}></span>
                    </span>
                </div>
                <Cards
                    {...this.props}/>
            </div>
        );
    }
}

Board.propTypes = propTypes;


module.exports = Board;
