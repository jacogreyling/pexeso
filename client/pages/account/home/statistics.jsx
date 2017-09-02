'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');


const propTypes = {
    _id: PropTypes.string,
    statsAvailable: PropTypes.bool,
    figures: PropTypes.object,
    highscores: PropTypes.object,
    flips: PropTypes.object,
};


class Statistics extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            figures: props.figures,
            highscores: props.highscores,
            flips: props.flips
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            figures: nextProps.figures,
            highscores: nextProps.highscores,
            flips: nextProps.flips
        });
    }


    render() {

        if (!this.props.hydrated) {
            return (
                <div className="loading padded">
                    <h3>Loading statistics...</h3>
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
                        <b>Best Casual:</b>
                        <span>{this.props.highscores.casual > 0 ? this.props.highscores.casual : '-'}</span>
                    </li>
                    <li>
                        <b>Best Medium:</b>
                        <span>{this.props.highscores.medium > 0 ? this.props.highscores.medium : '-'}</span>
                    </li>
                    <li>
                        <b>Best Hard:</b>
                        <span>{this.props.highscores.hard > 0 ? this.props.highscores.hard : '-'}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <b>Total Flips:</b>
                        <span>{this.props.flips.total > 0 ? this.props.flips.total : '-'}</span>
                    </li>
                    <li>
                        <b>Matched Flips:</b>
                        <span>{this.props.flips.matched > 0 ? this.props.flips.matched : '-'}</span>
                    </li>
                    <li>
                        <b>Wrong Flips:</b>
                        <span>{this.props.flips.wrong > 0 ? this.props.flips.wrong : '-'}</span>
                    </li>
                </ul>
            </div>
        );
    }
}

Statistics.propTypes = propTypes;


module.exports = Statistics;
