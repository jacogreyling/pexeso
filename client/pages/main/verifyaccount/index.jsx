'use strict';

const Actions = require('./actions');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');
const Spinner = require('../../../components/form/spinner.jsx');
const Store = require('./store');


const Helmet = ReactHelmet.Helmet;
const Link = ReactRouter.Link;
const propTypes = {
    match: PropTypes.object
};


class ResetPage extends React.Component {
    constructor(props) {

        super(props);

        this.input = {};
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

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.verifyAccount({
            token: this.props.match.params.token
        });
    }

    render() {

        const alerts = [];

        if (this.state.success) {
            alerts.push(<div key="success">
                <div className="alert alert-success">
                    Your account has been verified. Please login.
                </div>
                <Link to="/login" className="btn btn-link">Back to login</Link>
            </div>);
        }

        if (this.state.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.state.error}
            </div>);
        }

        let formElements;

        if (!this.state.success) {
            formElements = <fieldset>

                <ControlGroup hideLabel={true} hideHelp={true}>
                    <Button
                        type="submit"
                        inputClasses={{ 'btn-primary': true }}
                        disabled={this.state.loading}>

                        Verify Account
                        <Spinner space="left" show={this.state.loading} />
                    </Button>
                </ControlGroup>
            </fieldset>;
        }

        return (
            <section className="container">
                <Helmet>
                    <title>Verify Account</title>
                </Helmet>
                <div className="container">
                    <h1 className="page-header">Verify your Account</h1>
                    <div className="row">
                        <div className="col-sm-6">
                            <h4 className="media-heading">
                                Please click the buttom below to verify your account
                            </h4>
                            <p style={{ marginTop: '10px' }}>
                                You will be redirected to the login page after the verification step.
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                {formElements}
                                {alerts}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

ResetPage.propTypes = propTypes;


module.exports = ResetPage;
