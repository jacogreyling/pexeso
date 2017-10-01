/* global window */
'use strict';

const React = require('react');
const Io = require('socket.io-client');
const Actions = require('./actions');
const Store = require('./store');
const ReactHelmet = require('react-helmet');
const ClassNames = require('classnames');


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
        socket = Io.connect(window.location.hostname + ':' + window.location.port);

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

        const contentClass = ClassNames({
            'contentbox' : true,
            'small' : !this.state.telemetry.hydrated
        });

        // Format the numbers, for pretty printing
        const formatUsers = this.state.telemetry.hydrated ? this.state.telemetry.users.toLocaleString('en') : 'Loading...';
        const formatSessions = this.state.telemetry.hydrated ? this.state.telemetry.sessions : 'Loading...';
        const formatApiCalls = this.state.telemetry.hydrated ? this.state.telemetry.apiCalls : 'Loading...';
        const formatGamesWon = this.state.telemetry.hydrated ? this.state.telemetry.games.won : 'Loading...';
        const formatGamesLost = this.state.telemetry.hydrated ? this.state.telemetry.games.lost : 'Loading...';
        const formatGamesAbandoned = this.state.telemetry.hydrated ? this.state.telemetry.games.abandoned : 'Loading...';

        return (
            <section className="section-home container">
                <Helmet>
                    <title>Admin - Dashboard</title>
                </Helmet>
                <div className="home">
                    <div className="stats">
                        <div className="card">
                            <div className="f c1 active">
                                <div className="description">Users</div>
                                <div className={contentClass}>{formatUsers}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c2 active">
                                <div className="description">Sessions</div>
                                <div className={contentClass}>{formatSessions}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c3">
                                <div className="description">API Calls</div>
                                <div className={contentClass}>{formatApiCalls}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c4">
                                <div className="description">Won</div>
                                <div className={contentClass}>{formatGamesWon}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c5">
                                <div className="description">Lost</div>
                                <div className={contentClass}>{formatGamesLost}</div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="f c6">
                                <div className="description">Abandoned</div>
                                <div className={contentClass}>{formatGamesAbandoned}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
