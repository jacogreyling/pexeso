'use strict';

const React = require('react');
const Moment = require('moment');
const io = require('socket.io-client');
const Actions = require('./actions');
const Store = require('./store');

let socket;

class HomePage extends React.Component {
    constructor(props) {

        super(props);

        // Retrieve the registered users
        Actions.getUserCount();

        // Retrieve logged in users
        Actions.getSessionCount();

        // Retrieve the telemetry statistics
        Actions.getAllStatistics();


        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

        // Connect to socket.io on the same hostname and port number from the server
        socket = io.connect(window.location.hostname + ':' + window.location.port);

        // Let's create all our socket listeners!
        socket.on('logged_in', (res) => {

            Actions.updateSessionCount(res);
        });

        socket.on('new_user', (res) => {

            Actions.updateActiveUserCount(res);
        });

        socket.on('statistics', (res) => {

            Actions.updateGameStatistics(res);
        });

        socket.on('api_calls', (res) => {

            Actions.updateApiStatistics(res);
        });
    }

    componentWillUnmount() {

        this.unsubscribeStore();

        socket.disconnect();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        const formatUsers = typeof this.state.telemetry.users === 'number' ?
                this.state.telemetry.users.toLocaleString('en') :
                0;

        const formatSessions = typeof this.state.telemetry.sessions === 'number' ?
                this.state.telemetry.sessions.toLocaleString('en') :
                0;

        const formatApiCalls = typeof this.state.telemetry.apiCalls === 'number' ?
                this.state.telemetry.apiCalls.toLocaleString('en') :
                0;

        const formatGamesWon = typeof this.state.telemetry.games.won === 'number' ?
                this.state.telemetry.games.won.toLocaleString('en') :
                0;

        const formatGamesLost = typeof this.state.telemetry.games.lost === 'number' ?
                this.state.telemetry.games.lost.toLocaleString('en') :
                0;

        const formatGamesAbandoned = typeof this.state.telemetry.games.abandoned === 'number' ?
                this.state.telemetry.games.abandoned.toLocaleString('en') :
                0;


        return (
            <section className="section-home container">
                <div className="home">
                    <div className="stats">

                        <div className="card">
                            <div className="f c1">
                                <div className="description">Registered Users</div>
                                <div className="contentbox">{formatUsers}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="f c2">
                                <div className="description">Active Sessions</div>
                                <div className="contentbox">{formatSessions}</div>
                            </div>
                        </div>

                        <div className="card">
                                <div className="f c3">
                                    <div className="description">API Calls</div>
                                    <div className="contentbox">{formatApiCalls}</div>
                                </div>
                        </div>

                        <div className="card">
                            <div className="f c4">
                                <div className="description">Games Won</div>
                                <div className="contentbox">{formatGamesWon}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="f c5">
                                <div className="description">Games Lost</div>
                                <div className="contentbox">{formatGamesLost}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="f c6">
                                <div className="description">Games Abandoned</div>
                                <div className="contentbox">{formatGamesAbandoned}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
