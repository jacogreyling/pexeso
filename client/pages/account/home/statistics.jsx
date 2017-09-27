'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const moment = require('moment');


const propTypes = {
    _id: PropTypes.string,
    figures: PropTypes.object,
    flips: PropTypes.object,
    highscores: PropTypes.object,
    hydrated: PropTypes.bool,
    showFetchFailure: PropTypes.bool,
    statsAvailable: PropTypes.bool
};


class Statistics extends React.Component {

    render() {

        if (!this.props.hydrated) {
            return (
                <div className="loading padded">
                    <h4>Loading statistics...</h4>
                </div>
            );
        }

        return (
            <div className="padded">
                <h2>Figures:&nbsp;
                    <span>
                        <b>{this.props.figures.won}</b>
                        <i>Won</i>
                        <b>{this.props.figures.lost}</b>
                        <i>Lost</i>
                        <b>{this.props.figures.abandoned}</b>
                        <i>Abandoned</i>
                    </span>
                </h2>
                <ul>
                    <li>
                        <b>Best Casual:&nbsp;</b>
                        <span>{this.props.highscores.casual.score > 0 ? this.props.highscores.casual.score : '-'}</span>
                    </li>
                    <li>
                        <b>Best Medium:&nbsp;</b>
                        <span>{this.props.highscores.medium.score > 0 ? this.props.highscores.medium.score : '-'}</span>
                    </li>
                    <li>
                        <b>Best Hard:&nbsp;</b>
                        <span>{this.props.highscores.hard.score > 0 ? this.props.highscores.hard.score : '-'}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <b>Total Flips:&nbsp;</b>
                        <span>{this.props.flips.total > 0 ? this.props.flips.total : '-'}</span>
                    </li>
                    <li>
                        <b>Matched Flips:&nbsp;</b>
                        <span>{this.props.flips.matched > 0 ? this.props.flips.matched : '-'}</span>
                    </li>
                    <li>
                        <b>Wrong Flips:&nbsp;</b>
                        <span>{this.props.flips.wrong > 0 ? this.props.flips.wrong : '-'}</span>
                    </li>
                </ul>
                <span className="played">
                    <b>Last Played:&nbsp;</b>
                    <span>{moment(this.props.lastPlayed).locale('en-gb').format("LLL")}</span>
                </span>
            </div>
        );
    }
}

Statistics.propTypes = propTypes;


module.exports = Statistics;
