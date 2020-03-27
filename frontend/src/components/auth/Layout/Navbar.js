import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavLink from '../../common/NavLink';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';



export default class Navbar extends Component {
    
    render =  () => {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="navbar-brand" href="#">Hacker Forum</a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/auth/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/auth/register">Register</Link>
                    </li>
                </ul>
            </nav>
        )
    }
}