'use strict';

const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class EventPage extends React.Component {
    render() {

        return (
            <section className="section-about container">
                <Helmet>
                    <title>Events</title>
                </Helmet>
                <div className="row">
                    <h1 className="page-header" style={{marginLeft: '15px', marginRight: '15px'}}>Join an event</h1>
                    <div className="col-sm-12">
                        <h4 className="media-heading">
                            <p>
                                Pexeso is best played during an event, competing with your peers and other members.
                            </p>
                            <p>
                                There are <b>two ways</b> to join an event. The first is to simply enter a link as provided by your event organizer
                                (e.g. <u>http://pexeso.io/event/MyCoolEvent</u>).
                                The second way is to login to your account, click 'Settings' and update the event code from there.
                            </p>
                            <p>
                                Once the event has elapsed, we will automatically reset this flag. You can only join <b>one event</b> at a time.
                            </p>
                            <p>
                                It's that easy!
                            </p>
                        </h4>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = EventPage;