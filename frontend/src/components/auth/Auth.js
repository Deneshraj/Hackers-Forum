import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Layout/Navbar';

export default class Auth extends Component {
    render() {
        return (
            <Fragment>
                <Navbar />
                <h1 className="text-center title">Welcome to Hacker's Forum</h1>
            </Fragment>
        )
    }
}
