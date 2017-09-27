'use strict';

const React = require('react');
const Moment = require('moment');
const io = require('socket.io-client');
const Actions = require('./actions');
const Store = require('./store');
const ReactHelmet = require('react-helmet');

const Helmet = ReactHelmet.Helmet;

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

        if (!this.state.telemetry.hydrated) {
            return (
                <section className="section-home container">
                    <Helmet>
                        <title>Admin</title>
                    </Helmet>
                    <div className="home">
                        <div className="stats">
                            <div className="card">
                                <div className="f c1 active">
                                    <div className="description">Registered Users</div>
                                    <div className="contentbox small">Loading...</div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="f c2 active">
                                    <div className="description">Active Sessions</div>
                                    <div className="contentbox small">Loading...</div>
                                </div>
                            </div>
                            <div className="card">
                                    <div className="f c3">
                                        <div className="description">API Calls</div>
                                        <div className="contentbox small">Loading...</div>
                                    </div>
                            </div>
                            <div className="card">
                                <div className="f c4">
                                    <div className="description">Won</div>
                                    <div className="contentbox small">Loading...</div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="f c5">
                                    <div className="description">Lost</div>
                                    <div className="contentbox small">Loading...</div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="f c6">
                                    <div className="description">Abandoned</div>
                                    <div className="contentbox small">Loading...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        };


        // Format the numbers, for pretty printing
        let formatUsers = this.state.telemetry.users;
        let formatSessions = this.state.telemetry.sessions;
        let formatApiCalls = this.state.telemetry.apiCalls;
        let formatGamesWon = this.state.telemetry.games.won;
        let formatGamesLost = this.state.telemetry.games.lost;
        let formatGamesAbandoned = this.state.telemetry.games.abandoned;

        return (
            <section className="section-home container">
                <Helmet>
                    <title>Admin</title>
                </Helmet>
                <div className="home">
                    <div className="stats">
                        <div className="card">
                            <div className="f c1 active">
                                <div className="description">Registered Users</div>
                                <div className="contentbox">{formatUsers.toLocaleString('en')}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c2 active">
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
                                <div className="description">Won</div>
                                <div className="contentbox">{formatGamesWon}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c5">
                                <div className="description">Lost</div>
                                <div className="contentbox">{formatGamesLost}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c6">
                                <div className="description">Abandoned</div>
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
