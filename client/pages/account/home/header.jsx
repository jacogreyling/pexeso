'use strict';

const React = require('react');
const PropTypes = require('prop-types');


const propTypes = {
    round: PropTypes.number,
    restart: PropTypes.func
};


class Header extends React.Component {
    constructor(props) {

        super(props);
    }

    render() {
        return (
            <div>
                <h2>Round: {this.props.round}</h2>
                <button className="button button--warning text-center" onClick={() => this.props.restart()} disabled={this.props.round === 0}>Restart</button>
            </div>
        )
    }
}

Header.propTypes = propTypes;


module.exports = Header;
