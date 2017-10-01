/* global window */
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
    timeout: PropTypes.number,
    pairsToMatch: PropTypes.number,
    round: PropTypes.number,
    status: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date)
};


class Board extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            active: props.active,
            status: props.status
        };

    }

    componentDidMount() {

        window.addEventListener('beforeunload', (e) => this.handleWindowClose(e));
    }

    componentWillReceiveProps(nextProps) {

        // This means we've finished the game, so lets update the statistics (hydrate)
        if (nextProps.status === 'won' && !nextProps.hydrated) {

            // Update the statistics
            Actions.updateStats({
                status: nextProps.status,
                level: nextProps.level,
                flips: nextProps.flips,
                timestamp: nextProps.timestamp,
                timeout: nextProps.timeout
            });

            // We've finished with the game and updated the statistics
            Actions.changeLogo('nice');
            Actions.gameStatisticsSaved();
        }

        this.setState({
            active: nextProps.active,
            status: nextProps.status
        });
    }

    onAnimationEnd() {

        const status = 'lost';

        // Update the statistics
        Actions.updateStats({
            status,
            level: this.props.level,
            flips: this.props.flips,
            timestamp: this.props.timestamp,
            timeout: this.props.timeout
        });

        // We've finished with the game and updated the statistics
        Actions.changeLogo('fail');
        Actions.endGameAndUpdateStatus(status);
    }

    abandonActiveGame(activeState) {

        // If we're still in the game whilst exiting
        if (activeState) {

            const status = 'abandoned';

            // Update the statistics
            Actions.updateStats({
                status,
                level: this.props.level,
                flips: this.props.flips,
                timestamp: this.props.timestamp,
                timeout: this.props.timeout
            });

            // We've finished with the game and updated the statistics
            Actions.changeLogo('stop');
            Actions.endGameAndUpdateStatus(status);
        }
    }

    onKeyPress(e) {

        // If Escape is pressed
        if (e.keyCode === 27) {

            this.abandonActiveGame(this.state.active);
        }
    }

    handleWindowClose() {

        this.abandonActiveGame(this.state.active);
    }

    componentWillUnmount() {

        this.abandonActiveGame(this.state.active);

        // Remove the event handler
        window.removeEventListener('onbeforeunload', (e) => this.handleWindowClose(e));
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
                <div className="timer">
                    <span className="bar-unfill">
                        <span onAnimationEnd={() => this.onAnimationEnd()} className="bar-fill" style={{ animation: this.props.timeout + 's linear 0s normal none 1 running timer' }}></span>
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
