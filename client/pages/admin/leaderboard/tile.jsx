'use strict';

const React = require('react');
const Store = require('./store');
const Actions = require('./actions');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');


const propTypes = {
    onClick: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    active: PropTypes.string,
    display: PropTypes.bool
};


class Tile extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            active: props.active
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            active: nextProps.active
        });
    }

    render() {

        const tileClass = ClassNames({
            'f' : true,
            [this.props.id] : true,
            'active' : this.state.active === this.props.name,
            'ph' : !this.props.display
        });

        const displayClass = ClassNames({
            'contentbox' : this.props.display,
            'box' : !this.props.display
        });

        // Check to see if the component has children
        let content;
        if (this.props.children) {
            content = this.props.children;
        } else if (typeof this.props.name !== 'undefined') {
            content = this.props.name;
        } else {
            content = "_empty";
        }

        return (
            <div className="card" onClick={() => this.props.onClick(this.props.name, this.props.history)}>
                <div className={tileClass}>
                    <div className={displayClass}>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}

Tile.propTypes = propTypes;


module.exports = Tile;
