/* global window */
'use strict';

const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');


const propTypes = {
    action: PropTypes.func,
    error: PropTypes.string,
    loading: PropTypes.bool
};


class verifyForm extends React.Component {
    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        if (!window.confirm('Are you sure?')) {
            return;
        }

        this.props.action();
    }

    render() {

        let alert;

        if (this.props.error) {
            alert = <Alert type="warning" message={this.props.error} />;
        }

        return (
            <div className="panel panel-warning panel-warning-zone">
                <div className="panel-heading">
                    <h3 className="panel-title">Verify User</h3>
                </div>
                <div className="panel-body">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        {alert}
                        <Button
                            type="submit"
                            inputClasses={{
                                'btn-warning': true,
                                'pull-right': true
                            }}
                            disabled={this.props.loading}>

                            Verify
                            <Spinner
                                space="left"
                                show={this.props.loading}
                            />
                        </Button>
                        <p>
                            This will manually validate the User.
                            The user will be made active and be allowed to login
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

verifyForm.propTypes = propTypes;


module.exports = verifyForm;
