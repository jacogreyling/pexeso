'use strict';

const React = require('react');
const Store = require('./store');
const Actions = require('./actions');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');


const propTypes = {
    id: PropTypes.number,
    position: PropTypes.string,
    statistics: PropTypes.bool,
    tiles: PropTypes.array,
    twist: PropTypes.bool
};


class Tile extends React.Component {
    constructor(props) {

        super(props);

        Actions.addTile(props.id);

        this.state = {
            id: props.id,
            active: false,
            twist: props.twist
        }
    }

    componentWillReceiveProps(nextProps) {

        let active = false;
        if (typeof nextProps.tiles[nextProps.id] !== 'undefined') {
            active = nextProps.tiles[nextProps.id].state;
        }

        this.setState({
            id: nextProps.id,
            active: active,
            twist: nextProps.twist
        });
    }

    toggleActive() {

        const twist = this.state.twist;

        if (!twist) {
            Actions.flipTile(this.state.id);
        }
    }

    render() {

        const tileClass = ClassNames({
            'card' : true,
            'left' : this.props.position === "left",
            'twist' : this.props.twist,
            'active' : this.state.active || this.props.twist
        });

        return (
            <div className={tileClass} onClick={this.toggleActive.bind(this)}>
                <div className="flipper">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

Tile.propTypes = propTypes;


module.exports = Tile;
