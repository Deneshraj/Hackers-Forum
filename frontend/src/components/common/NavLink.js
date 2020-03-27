import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class NavLink extends React.Component {
    render() {
        var isActive = (location.pathname === this.props.to);
        var activeClass = isActive ? 'active' : '';
        return(
            <Link className={'nav-link ' + activeClass} to={this.props.to} id={this.props.id} onClick={() => this.props.changeClass(this.props.id)}>
                {this.props.children}
            </Link>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};

export default NavLink;