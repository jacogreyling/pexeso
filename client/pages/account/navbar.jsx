'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');
const ClassNames = require('classnames');


const Link = ReactRouter.Link;
const propTypes = {
    location: PropTypes.object
};


class Navbar extends React.Component {
    constructor(props) {

        super(props);

        // We find this to see if we should render the 'admin' link
        let adminRole = false;
        if (document.head.querySelector("[name=pexeso-roles]") !== null) {
            const roles = document.head.querySelector("[name=pexeso-roles]").content;
            adminRole = roles.includes("admin");
        }

        this.state = {
            navBarOpen: false,
            adminRole: adminRole
        };
    }

    componentWillReceiveProps() {

        this.setState({ navBarOpen: false });
    }

    classForPath(path) {

        return ClassNames({
            active: this.props.location.pathname === path
        });
    }

    toggleMenu() {

        this.setState({ navBarOpen: !this.state.navBarOpen });
    }

    render() {

        const navBarCollapse = ClassNames({
            'navbar-collapse': true,
            collapse: !this.state.navBarOpen
        });

        const renderAdminClass = ClassNames({
            hide: !this.state.adminRole
        });

        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/account">
                            <img className="navbar-logo" src="/public/media/logo-square.png" />
                            <span className="navbar-brand-label">pexeso</span>
                        </Link>
                        <button
                            className="navbar-toggle collapsed"
                            onClick={this.toggleMenu.bind(this)}>

                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className={navBarCollapse}>
                        <ul className="nav navbar-nav">
                            <li className={this.classForPath('/account')}>
                                <Link to="/account">Home</Link>
                            </li>
                            <li className={this.classForPath('/account/settings')}>
                                <Link to="/account/settings">Settings</Link>
                            </li>
                            <li className={renderAdminClass}>
                                <a href="/admin">Admin</a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="https://waffle.io/jacogreyling/pexeso/join"
                                    className="ico-logo nav-list-icon"><span>Open ticket</span></a>
                            </li>
                            <li>
                                <a href="/login/logout">Sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

Navbar.propTypes = propTypes;


module.exports = Navbar;
