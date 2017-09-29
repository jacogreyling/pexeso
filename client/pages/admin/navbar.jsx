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
        let accountRole = false;
        if (document.head.querySelector("[name=pexeso-roles]") !== null) {
            const roles = document.head.querySelector("[name=pexeso-roles]").content;
            accountRole = roles.includes("account");
        }

        this.state = {
            navBarOpen: false,
            accountRole: accountRole
        };
    }

    componentWillReceiveProps() {

        this.setState({ navBarOpen: false });
    }

    classForPath(pathPattern) {

        return ClassNames({
            active: this.props.location.pathname.match(pathPattern)
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

        const renderAccountClass = ClassNames({
            hide: !this.state.accountRole
        });

        return (
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/admin">
                            <img
                                className="navbar-logo"
                                src="/public/media/logo-square-inverse.png"
                            />
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
                            <li className={renderAccountClass}>
                                <a href="/account">My Account</a>
                            </li>
                            <li className={this.classForPath(/^\/admin\/accounts/)}>
                                <Link to="/admin/accounts">Accounts</Link>
                            </li>
                            <li className={this.classForPath(/^\/admin\/admins/)}>
                                <Link to="/admin/admins">Admins</Link>
                            </li>
                            <li className={this.classForPath(/^\/admin\/admin-groups/)}>
                                <Link to="/admin/admin-groups">Admin Groups</Link>
                            </li>
                            <li className={this.classForPath(/^\/admin\/users/)}>
                                <Link to="/admin/users">Users</Link>
                            </li>
                            <li className={this.classForPath(/^\/admin\/leaderboard/)}>
                                <Link to="/admin/leaderboard">Leaderboard</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
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
