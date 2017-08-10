'use strict';

const React = require('react');
const Store = require('./store');
const PropTypes = require('prop-types');
const Actions = require('./actions');
const Header = require('./header.jsx');
const CardList = require('./card-list.jsx');


class HomePage extends React.Component {
    constructor(props) {

        super(props);

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
            <section className="section-home container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="well text-center">
                            <div className="board container">
                                <Header round={this.state.memory.round} restart={Actions.restart} />
                                <CardList cards={this.state.memory.cards} flipCard={Actions.flipCard} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
