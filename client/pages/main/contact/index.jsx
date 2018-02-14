'use strict';

const Form = require('./form.jsx');
const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class ContactPage extends React.Component {
    render() {

        return (
            <section className="section-contact container">
                <Helmet>
                    <title>Contact Us</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header" style={{marginLeft: '15px', marginRight: '15px'}}>Send a message</h1>
                    <div className="col-sm-6">
                        <Form />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = ContactPage;
