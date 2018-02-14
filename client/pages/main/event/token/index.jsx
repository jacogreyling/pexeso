'use strict';

const Actions = require('./actions');
const Button = require('../../../../components/form/button.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');
const Spinner = require('../../../../components/form/spinner.jsx');
const Store = require('./store');


const Helmet = ReactHelmet.Helmet;
const Link = ReactRouter.Link;
const propTypes = {
    match: PropTypes.object
};


class EventTokenPage extends React.Component {
    constructor(props) {

        super(props);

        this.state = Store.getState();
    }

    componentWillMount() {
        
        Actions.getEvent(this.props.match.params.token);
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

        let heading, description;

        if (this.state.loading) {
            heading = 'Event';
            description = (<div>Loading...</div>);
        }
        else if ((this.state.error) || (this.state.success && !this.state.isActive)) {
            heading = 'Oops!';
            description = (<div>The event id <b>{this.props.match.params.token}</b> is not active or does not exist. Please make sure you've entered the correct value.</div>);
        }
        else if (this.state.isActive) {
            heading = 'Let\'s Go!';
            description = (<div>For some reason the redirect did not work. Please click <a href="/">here</a> to continue...</div>);
        }
 
        return (
            <section className="container">
                <Helmet>
                    <title>Event</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header" style={{marginLeft: '15px', marginRight: '15px'}}>{heading}</h1>
                    <div className="col-sm-12">
                        <h4 className="media-heading">
                            {description}
                        </h4>
                    </div>
                </div>
            </section>
        );
    }
}

EventTokenPage.propTypes = propTypes;


module.exports = EventTokenPage;
