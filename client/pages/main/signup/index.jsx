'use strict';

const Form = require('./form.jsx');
const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class SignupPage extends React.Component {
    render() {

        return (
            <section className="container">
                <Helmet>
                    <title>Sign Up</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header" style={{marginLeft: '15px', marginRight: '15px'}}>Sign Up</h1>
                    <div className="col-sm-6">
                        <Form />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = SignupPage;
