/* global window */
'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const FilterForm = require('./filter-form.jsx');
const Paging = require('../../../components/paging.jsx');
const React = require('react');
const Store = require('./store');
const Qs = require('qs');
const Results = require('./results.jsx');
const Tiles = require('./tiles.jsx');
const Events = require('./events.jsx');
const Io = require('socket.io-client');
const ReactHelmet = require('react-helmet');
const Moment = require('moment');


const Helmet = ReactHelmet.Helmet;


const propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
};


let socket;

class Leaderboard extends React.Component {
    constructor(props) {

        super(props);

        // If no query is passed return default view - top 10 results
        if (this.props.location.search === '') {

            Actions.retrieveTopTen('casual');
        }
        else {

            const query = Qs.parse(this.props.location.search.substring(1));

            if ((typeof query.level !== 'undefined') && (query.level !== '')) {

                Actions.setLevel(query.level);
            }
            else {

                // If there is a search string but level is NOT set, 'reset' it
                query.level = 'casual';
                Actions.setLevel('casual');
            }

            // If the 'live' flag is set and the event code, still return the top 10 results
            if (((typeof query.live !== 'undefined') && (query.live)) && (typeof query.event !== 'undefined')) {

                Actions.retrieveTopTenForEvent(query.level, query.event);
            }
            else {

                if (typeof query.dateFrom !== 'undefined') {

                    Actions.setDateFrom(Moment(query.dateFrom));
                }
    
                Actions.getResults(query);
            }
        }

        this.els = {};
        this.state = Store.getState();
    }

    componentWillReceiveProps(nextProps) {

        // It seems like the local state has not yet been updated,
        // take the global state instead
        const level = Store.getState().leaderboard.level;

        // Return the 'live' top 10 results if no query params are set
        if (nextProps.location.search === '') {

            Actions.retrieveTopTen(level);
        }
        else {

            const query = Qs.parse(nextProps.location.search.substring(1));

            // In case we have switched tiles, let's update the level
            if (query.level !== level) {
                query.level = level;
            }

            // If the 'live' flag is set and the event code, still return the top 10 results
            if (((typeof query.live !== 'undefined') && (query.live)) && (typeof query.event !== 'undefined')) {

                Actions.retrieveTopTenForEvent(level, query.event);
            }
            else {
                        
                if (typeof query.dateFrom !== 'undefined') {

                    Actions.setDateFrom(Moment(query.dateFrom));
                }

                Actions.getResults(query);
            }
        }
    }

    componentWillMount() {

        // Retrieve all 'active' registered events
        Actions.getActiveEvents();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        // Register this, so that we can make sure we 'unload' the io socket listners
        window.addEventListener('beforeunload', (e) => this.handleWindowClose(e));

        if (this.state.leaderboard.live) {
            this.registerIoListners();
        }
    }

    componentWillUnmount() {

        this.unsubscribeStore();

        this.deregisterIoListners();
    }

    handleWindowClose() {

        this.deregisterIoListners();
    }

    registerIoListners() {

        // Connect to socket.io on the same hostname and port number from the server
        socket = Io.connect(window.location.hostname + ':' + window.location.port);

        // Let's create our socket listener!
        socket.on('new_score', (res) => {

            // Only update for the current level!
            if (this.state.leaderboard.level === res.level) {

                const arrayLength = this.state.leaderboard.data.length;

                // If the score is not higher than the lowest then don't bother
                if ((arrayLength < 10) || (res.score > this.state.leaderboard.data[arrayLength - 1].score)) {

                    Actions.insertScore(res, this.state.leaderboard.data);
                }
            }
        });
    }

    deregisterIoListners() {
        
        if (socket) {
            socket.disconnect();
        }
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    onFiltersChange(event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        Actions.changeSearchQuery(this.els.filters.state, this.props.history);
    }

    onPageChange(page) {

        this.els.filters.changePage(page);
    }

    toggleLiveScoring() {

        const level = this.state.leaderboard.level;
        const event = this.state.leaderboard.selectedEvent;

        let query = {};

        // If we're filtering for an event, add that to the query string
        if (event) {
            query.event = event
        }

        if (this.state.leaderboard.live) {
            this.deregisterIoListners();

            // Now query all records for this level
            query.level = level;

            Actions.changeSearchQuery(query, this.props.history);
        }
        else {
            this.registerIoListners();

            Actions.resetDateFrom();

            if (Object.keys(query).length === 0) {

                Actions.resetSearchQuery(this.props.history);
            }
            else {
                query.live = true;

                Actions.changeSearchQuery(query, this.props.history);
            }
        }
    }

    changeEvent(e) {

        const event = e.target.value;

        // If it's the same event or null, ignore it
        if ((this.state.leaderboard.selectedEvent === event) || (typeof event === 'undefined')) {
            return;
        }

        let query = {};
        
        if ((typeof event !== 'undefined') && (event !== '')) {
            query.event = event;
        
            if (this.state.leaderboard.live) {
                query.live = true;
            }
        }

        Actions.changeEvent(e.target.value);

        if (Object.keys(query).length === 0) {

            Actions.resetSearchQuery(this.props.history);
        }
        else {

            Actions.changeSearchQuery(query, this.props.history);
        }
    }

    changeActiveRow() {

        setTimeout(() => {

            Actions.removePosition();

        }, 1000); // Timeout for highlighted state in milliseconds
    }

    render() {

        // If we're still fetching results
        if (!this.state.leaderboard.hydrated) {
            return (
                <section className="container">
                    <Events />
                    <Tiles
                        level={this.state.leaderboard.level}
                        live={this.state.leaderboard.live}
                        event={this.state.leaderboard.selectedEvent}
                        dateFrom={this.state.leaderboard.dateFrom}
                        onToggleLive={this.toggleLiveScoring.bind(this)}
                        query={Qs.parse(this.props.location.search.substring(1))}
                        history={this.props.history}
                    />
                    <h4 className="leaderboard page-header">
                        Loading...
                    </h4>
                </section>
            );
        }

        // Only return top 10 results in 'live' mode, with no filters
        if (this.state.leaderboard.live) {

            // If we have a new 'highscore' highlight it briefly
            if (typeof this.state.leaderboard.position === 'number') {
                this.changeActiveRow();
            }

            return (
                <section className="container">
                    <Helmet>
                        <title>Leaderboard - Live</title>
                    </Helmet>
                    <Events
                        list={this.state.leaderboard.events}
                        active={this.state.leaderboard.selectedEvent}
                        onSelect={this.changeEvent.bind(this)}/>
                    <Tiles
                        level={this.state.leaderboard.level}
                        live={this.state.leaderboard.live}
                        event={this.state.leaderboard.selectedEvent}
                        dateFrom={this.state.leaderboard.dateFrom}
                        onToggleLive={this.toggleLiveScoring.bind(this)}
                        query={Qs.parse(this.props.location.search.substring(1))}
                        history={this.props.history}
                    />
                    <Results
                        level={this.state.leaderboard.level}
                        data={this.state.leaderboard.data}
                        position={this.state.leaderboard.position}
                    />
                </section>
            );
        }

        return (
            <section className="container">
                <Helmet>
                    <title>Leaderboard</title>
                </Helmet>
                <Events
                        list={this.state.leaderboard.events}
                        active={this.state.leaderboard.selectedEvent}
                        onSelect={this.changeEvent.bind(this)}/>
                <Tiles
                    level={this.state.leaderboard.level}
                    live={this.state.leaderboard.live}
                    event={this.state.leaderboard.selectedEvent}
                    dateFrom={this.state.leaderboard.dateFrom}
                    onToggleLive={this.toggleLiveScoring.bind(this)}
                    query={Qs.parse(this.props.location.search.substring(1))}
                    history={this.props.history}
                />
                <FilterForm
                    ref={(c) => (this.els.filters = c)}
                    loading={this.state.leaderboard.loading}
                    query={Qs.parse(this.props.location.search.substring(1))}
                    onChange={this.onFiltersChange.bind(this)}
                />

                <Results
                    level={this.state.leaderboard.level}
                    items={this.state.leaderboard.items}
                    data={this.state.leaderboard.data}
                    query={Qs.parse(this.props.location.search.substring(1))}
                />
                <Paging
                    ref={(c) => (this.els.paging = c)}
                    pages={this.state.leaderboard.pages}
                    items={this.state.leaderboard.items}
                    loading={this.state.leaderboard.loading}
                    onChange={this.onPageChange.bind(this)}
                />
            </section>
        );
    }
}

Leaderboard.propTypes = propTypes;


module.exports = Leaderboard;
