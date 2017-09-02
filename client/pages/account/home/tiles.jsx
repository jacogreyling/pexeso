'use strict';

const React = require('react');
const Store = require('./store');
const Actions = require('./actions');
const Tile = require('./tile.jsx');
const Statistics = require('./statistics.jsx');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');


const propTypes = {
    boardActive: PropTypes.bool,
    logo: PropTypes.string,
    statistics: PropTypes.object,
    tile: PropTypes.array
};


class Tiles extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            logo: props.logo,
            tile: props.tile
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            logo: nextProps.logo,
            tile: nextProps.tile
        });
    }

    startGame(level) {

        Actions.startGame(level);
    }

    render() {

        const logoClass = ClassNames({
            'logo' : true,
            'hidden' : this.props.boardActive
        });

        const logoArray = this.props.logo.split('');

        return (
            <div className={logoClass}>
            <Tile
                id={1}
                position="left"
                tiles={this.props.tile}
                twist={false}
                statistics={true}>
                <div className="f c1">{logoArray[0]}</div>
                <div className="b contentbox" id="stats">
                    <Statistics
                        {...this.props.statistics}/>
                </div>
            </Tile>

            <Tile
                id={2}
                position="right"
                tiles={this.props.tile}
                twist={true}>
                <div className="b f">
                    <div className="c2">{logoArray[1]}</div>
                </div>
            </Tile>

            <Tile
                id={3}
                position="left"
                tiles={this.props.tile}
                twist={false}>
                <div className="f c3">{logoArray[2]}</div>
                <div className="b contentbox instructions">
                    <div className="padded">
                        <h2>Instructions</h2>
                        <p>Click the 'P' tile to select a level to play. Press [ESC] in-game to abandon the game.</p>
                        <p>Click the gray cards to see what symbol they uncover and try to find the matching symbol underneath the other cards.</p>
                        <p>Uncover two matching symbols at once to eliminate them from the game.</p>
                        <p>Eliminate all cards as fast as you can to win the game. Have fun!</p>
                    </div>
                </div>
            </Tile>

            <Tile
                id={4}
                position="right"
                tiles={this.props.tile}
                twist={false}>
                <div className="f c4">{logoArray[3]}</div>
                <div className="b contentbox levels">
                    <a className="play" onClick={() => this.startGame("casual")}>Casual</a>
                    <a className="play" onClick={() => this.startGame("medium")}>Medium</a>
                    <a className="play" onClick={() => this.startGame("hard")}>Hard</a>
                </div>
            </Tile>
        </div>
        )
    }
}

Tiles.propTypes = propTypes;


module.exports = Tiles;
