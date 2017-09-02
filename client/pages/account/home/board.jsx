'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const Cards = require('./cards.jsx');


const propTypes = {
    active: PropTypes.bool,
    cardSize: PropTypes.number,
    cards: PropTypes.array,
    guess1: PropTypes.number,
    guess2: PropTypes.number,
    level: PropTypes.string,
    pairsToMatch: PropTypes.number,
    round: PropTypes.number,
    statistics: PropTypes.object,
    timestamp: PropTypes.instanceOf(Date)
};


class Board extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            active: props.active,
            statistics: props.statistics,
            level: props.level,
            timestamp: props.timestamp
        }

    }

    onAnimationEnd() {

        let flips = this.state.statistics.flips;
        let figures = this.state.statistics.figures;
        let highscores = this.state.statistics.highscores;

        // Set the game state
        // We shouldn't have a 'win' state here but just in case of timing
        if (this.state.statistics.status === "won") {
            figures.won = figures.won + 1;

            CalculateHighscore({
                timestamp: this.state.timestamp,
                level: this.state.level,
                flips: flips,
                highscores: highscores
            });

        // Change it from 'in-progress' to 'lost'
        } else {
            this.state.statistics.status = "lost";
            figures.lost = figures.lost + 1;
        }

        // Update the statistics
        Actions.updateStats({
            status: this.state.statistics.status,
            statistics: {
                figures: figures,
                highscores: highscores,
                flips: flips
            }
        });

        Actions.stopGame("fail");
    }

    onKeyPress(e) {

        // If Escape is pressed
        if(e.keyCode === 27) {

            let flips = this.state.statistics.flips;
            let figures = this.state.statistics.figures;
            let highscores = this.state.statistics.highscores;

            this.state.statistics.status = "abandoned";
            figures.abandoned = figures.abandoned + 1;

            // Update the statistics
            Actions.updateStats({
                status: this.state.statistics.status,
                statistics: {
                    figures: figures,
                    highscores: highscores,
                    flips: flips
                }
            });

            Actions.stopGame("flip");
        }

    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            active: nextProps.active,
            statistics: nextProps.statistics,
            level: nextProps.level,
            timestamp: nextProps.timestamp
        });

    }

    render() {

        if (!this.state.active) {
            return null;
        }

        return (
            <div id="g" className={this.props.level} onKeyDown={(e) => this.onKeyPress(e)} tabIndex="0">
                <div className="timer" ref="timer">
                    <span className="bar-unfill">
                        <span onAnimationEnd={this.onAnimationEnd.bind(this)} className="bar-fill" style={{animation: '90000ms linear 0s normal none 1 running timer'}}></span>
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
