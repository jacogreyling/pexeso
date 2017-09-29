'use strict';

const React = require('react');
const Store = require('./store');
const Actions = require('./actions');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');
const Tile = require('./tile.jsx');

// Used for the calendar
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


const propTypes = {
    level: PropTypes.string,
    live: PropTypes.bool,
    dateFrom: PropTypes.object,
    onToggleLive: PropTypes.func,
    query: PropTypes.object,
    history: PropTypes.object
};


class Tiles extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            level: props.level,
            live: props.live,
            history: props.history,
            query: props.query
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            level: nextProps.level,
            live: nextProps.live,
            history: nextProps.history,
            query: nextProps.query
        });
    }

    activeCard(level) {

        // If it's the same level, ignore it
        if ((this.state.level === level) || (typeof level === 'undefined')) {
            return;
        }

        // If in 'live' mode, make sure the search query is removed
        if (this.state.live) {

            Actions.resetSearchQuery(this.state.history);
        } else {

            const query = this.state.query;
            query.level = level;

            Actions.changeSearchQuery(query, this.state.history);
        }

        Actions.setLevel(level, this.state.live);
    }

    handleDateChange(date) {

        Actions.changeDateFrom(date);
    }

    handleClickOutside() {

        if (typeof this.props.dateFrom !== 'undefined') {

            let query = {};

            // We need to turn off 'live' mode first
            if (this.state.live) {

                Actions.setLiveMode(false);

                query = {
                    dateFrom: this.props.dateFrom.utc().format(),
                    level: this.state.level
                };
            } else {

                // Just update the time
                query = this.state.query;
                query.dateFrom = this.props.dateFrom.utc().format();
            }

            // Update the search query string
            Actions.changeSearchQuery(query, this.state.history);

            // An update to the results will happen in the 'componentWillReceiveProps'
            // method for index.jsx
        }
    }


    render() {

        const liveClass = ClassNames({
            'live' : this.props.live,
            'pause' : !this.props.live,
        });

        let buttonText;
        if (this.props.live) {
            buttonText = "Pause";
        } else {
            buttonText = "Live";
        }

        return (
            <div className="cards">
                <div className="level">

                    <Tile onClick={this.activeCard.bind(this)}
                        name="casual"
                        id="c1"
                        display={true}
                        active={this.props.level}
                    />
                    <Tile onClick={this.activeCard.bind(this)}
                        name="medium"
                        id="c2"
                        display={true}
                        active={this.props.level}
                    />
                    <Tile onClick={this.activeCard.bind(this)}
                        name="hard"
                        id="c3"
                        display={true}
                        active={this.props.level}
                    />
                    <Tile name="info"
                        id="c4"
                        display={false}
                        active={this.props.level}>
                        <div className="date-picker">
                            <div className="switch">
                                <div className={liveClass}></div>
                            </div>
                            <h2>Timeframe</h2>

                            <DatePicker
                                selected={this.props.dateFrom}
                                onChange={this.handleDateChange.bind(this)}
                                onClickOutside={this.handleClickOutside.bind(this)}
                                shouldCloseOnSelect={false}
                                showTimeSelect
                                popperPlacement="left"
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                dateFormat="LLL"
                                maxDate={moment()}
                                locale="en-gb"
                                placeholderText="Select start time" />
                            <button onClick={() => this.props.onToggleLive()} type="button" className="btn btn-default">{buttonText}</button>
                        </div>
                    </Tile>

                </div>
            </div>
        )
    }
}

Tiles.propTypes = propTypes;


module.exports = Tiles;
