/* global window */
'use strict';

const React = require('react');
const Io = require('socket.io-client');
const Actions = require('./actions');
const Store = require('./store');
const ReactHelmet = require('react-helmet');
const ClassNames = require('classnames');
const Line = require('react-chartjs-2').Line;


const Helmet = ReactHelmet.Helmet;


let socket;

class HomePage extends React.Component {
    constructor(props) {

        super(props);

        // Retrieve the telemetry statistics
        Actions.getAllStatistics();

        // Get the game scores for the last 60 minutes so we can graph it
        Actions.retrieveGameScores(60);

        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
        this.registerIoListners();

        // Register this, so that we can make sure we 'unload' the io socket listners
        window.addEventListener('beforeunload', (e) => this.handleWindowClose(e));

        const self = this;

        // Register timer for dynamic graph updates
        this.intervalId = setInterval(() => {

            Actions.updateGraphDatasets(self.state.graph.realtimeData);

        }, 60000);
    }

    componentWillUnmount() {

        this.unsubscribeStore();

        // Un-register the Io listner to prevent leak
        this.deregisterIoListners();

        // Remove the event handler
        window.removeEventListener('onbeforeunload', (e) => this.handleWindowClose(e));

        // Clear the interval, used for updating the graph
        clearInterval(this.intervalId);
    }

    handleWindowClose() {

        this.deregisterIoListners();
    }

    registerIoListners() {

        // Connect to socket.io on the same hostname and port number from the server
        socket = Io.connect(window.location.hostname + ':' + window.location.port);

        // Let's create all our socket listeners!
        socket.on('logged_in', (res) => {

            Actions.updateSessionCount(res);
        });

        socket.on('new_user', (res) => {

            Actions.updateUserCount(res);
        });

        socket.on('statistics', (res) => {

            Actions.updateGameStatistics(res);
        });

        socket.on('api_calls', (res) => {

            Actions.updateApiStatistics(res);
        });

        socket.on('game_won', (res) => {

            Actions.updateGamesWon(res);
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

    render() {

        // Initialize variables
        let formatUsers;
        let formatSessions;
        let formatApiCalls;
        let formatGamesWon;
        let formatGamesLost;
        let formatGamesAbandoned;

        // If we're still loading stats, show 'loading' to the user
        if (!this.state.telemetry.hydrated) {
            formatUsers = 'Loading...';
            formatSessions = 'Loading...';
            formatApiCalls = 'Loading...';
            formatGamesWon = 'Loading...';
            formatGamesLost = 'Loading...';
            formatGamesAbandoned = 'Loading...';
        }
        // Format the numbers, for pretty printing
        else {
            formatUsers = typeof this.state.telemetry.users === 'undefined' ?
                0 :
                this.state.telemetry.users.toLocaleString('en');
            formatSessions = typeof this.state.telemetry.sessions === 'undefined' ?
                0 :
                this.state.telemetry.sessions.toLocaleString('en');
            formatApiCalls = typeof this.state.telemetry.apiCalls === 'undefined' ?
                0 :
                this.state.telemetry.apiCalls.toLocaleString('en');
            formatGamesWon = typeof this.state.telemetry.games.won === 'undefined' ?
                0 :
                this.state.telemetry.games.won.toLocaleString('en');
            formatGamesLost = typeof this.state.telemetry.games.lost === 'undefined' ?
                0 :
                this.state.telemetry.games.lost.toLocaleString('en');
            formatGamesAbandoned = typeof this.state.telemetry.games.abandoned === 'undefined' ?
                0 :
                this.state.telemetry.games.abandoned.toLocaleString('en');
        }

        const contentClass = ClassNames({
            'contentbox' : true,
            'small' : !this.state.telemetry.hydrated
        });

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
                        <div className="card wide">
                            <div className="f c7 clear">
                                <Line data={this.state.graph.data}
                                    width={900}
                                    height={300}
                                    options={{
                                        title: {
                                            display: true,
                                            position: 'top',
                                            fontSize: 14,
                                            fontStyle: 'normal',
                                            text: 'Games Won Rate'
                                        },
                                        legend: {
                                            display: true,
                                            position: 'right'
                                        },
                                        maintainAspectRatio: false,
                                        animation: {
                                            duration: 0
                                        },
                                        hover: {
                                            mode: 'nearest',
                                            intersect: true
                                        },
                                        tooltips: {
                                            callbacks: {
                                                title: function (tooltipItem, data) {

                                                    return tooltipItem[0].xLabel.locale('en-gb').format('LLL');
                                                }
                                            }
                                        },
                                        scales: {
                                            xAxes: [{
                                                id: 'timeline',
                                                type: 'time',
                                                distribution: 'series',
                                                time: {
                                                    unit: 'minute',
                                                    displayFormats: {
                                                        minute: 'H:mm'
                                                    }
                                                }
                                            }],
                                            yAxes: [{
                                                id: 'rounds',
                                                type: 'linear',
                                                ticks: {
                                                    beginAtZero:true,
                                                    suggestedMin: 0,
                                                    suggestedMin: 5,
                                                    stepSize: 1
                                                }
                                            }]
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
