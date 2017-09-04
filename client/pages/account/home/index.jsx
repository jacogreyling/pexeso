'use strict';

const React = require('react');
const Store = require('./store');
const PropTypes = require('prop-types');
const Actions = require('./actions');
const Tiles = require('./tiles.jsx');
const Board = require('./board.jsx');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class HomePage extends React.Component {
    constructor(props) {

        super(props);

        Actions.getStats();

        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        return (
            <section className="section-home container" onClick={() => (void(0))}>
                <Helmet>
                    <title>Home</title>
                </Helmet>
                <div className="game">

                    <Board
                        {...this.state.board}
                        statistics={this.state.stats}/>

                    <Tiles
                        {...this.state.tiles}
                        boardActive={this.state.board.active}
                        statistics={this.state.stats}/>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
