/* global window */
'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const Paging = require('../../../components/paging.jsx');
const React = require('react');
const Store = require('./store');
const Qs = require('qs');
const Results = require('./results.jsx');
const Tiles = require('./tiles.jsx');
const ReactHelmet = require('react-helmet');
const Moment = require('moment');


const Helmet = ReactHelmet.Helmet;


const propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
};


class Leaderboard extends React.Component {
    constructor(props) {

        super(props);

        Actions.getEvent();
        Actions.getUser();
        Actions.retrieveTopTen('casual');

        this.els = {};
        this.state = Store.getState();
    }

    componentWillReceiveProps(nextProps) {

        // It seems like the local state has not yet been updated,
        // take the global state instead
        const level = Store.getState().leaderboard.level;

        Actions.retrieveTopTen(level);
    }

    componentDidMount() {
        
        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
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


    render() {

        // If we're still fetching results
        if (!this.state.leaderboard.hydrated) {
            return (
                <section className="container">
                    <Helmet>
                        <title>Leaderboard</title>
                    </Helmet>
                    <div className="row">
                        <div className="col-sm-12">
                            <Tiles
                                level={this.state.leaderboard.level}
                                query={Qs.parse(this.props.location.search.substring(1))}
                                history={this.props.history}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <h4 className="leaderboard page-header">
                                Loading...
                             </h4>
                        </div>
                    </div>

                </section>
            );
        }


        return (
            <section className="container">
                <Helmet>
                    <title>Leaderboard</title>
                </Helmet>
                <div className="row">
                    <div className="col-sm-12">
                        <Tiles
                            level={this.state.leaderboard.level}
                            query={Qs.parse(this.props.location.search.substring(1))}
                            history={this.props.history}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <Results
                            level={this.state.leaderboard.level}
                            items={this.state.leaderboard.items}
                            data={this.state.leaderboard.data}
                            query={Qs.parse(this.props.location.search.substring(1))}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

Leaderboard.propTypes = propTypes;


module.exports = Leaderboard;
