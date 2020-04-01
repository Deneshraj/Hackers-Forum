import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import NavLink from '../common/NavLink';

export default class Header extends Component {
    state = {
        active: "home",
    }

    render() {
        const changeActive = (active) => {
            document.getElementById(this.state.active).classList.remove('active');

            let newState = this.state;
            newState.active = active;
            this.setState(newState);
            
            document.getElementById(active).classList.add('active');
        }

        return (
            <div className="header">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-nav">
                    <Link to="/" className="navbar-brand">Hacker's Forum</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink to="/" id="home" changeClass={changeActive}>home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about" id="about" changeClass={changeActive}>about</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/blogs" id="blogs" changeClass={changeActive}>blogs</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/settings" id="settings" changeClass={changeActive}>settings</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/profile/" + this.props.username} id="logout" changeClass={changeActive}>profile</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/logout" id="logout" changeClass={changeActive}>logout</NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}
