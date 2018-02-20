'use strict';

const React = require('react');
const Actions = require('./actions');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');


const propTypes = {
    list: PropTypes.array,
    active: PropTypes.string,
    onSelect: PropTypes.func
};


class Events extends React.Component {

    constructor(props) {

        super(props);

        let active = '';
        if (props.active) {
            active = props.active;
        }

        this.state = {
            active
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            active: nextProps.active
        });
    }


    render() {

        let options = [];
        if (Array.isArray(this.props.list)) {
            options = this.props.list.map((record) => {
                return (
                    <option value={record.name} key={record._id}>{record.name}</option>
                );
            });
        }

        return (
            <div className="events">
                <div className="description">
                    Event:&nbsp; 
                </div>
                <div className="options">
                <select className="selectevent" onChange={this.props.onSelect} value={this.state.active}>     
                    <option value=''>-- Select an event --</option>
                    {options}
                </select> 
                </div>
            </div>
        );
    }
}

Events.propTypes = propTypes;


module.exports = Events;
