import React, { Component } from 'react';
import { alertError } from '../common/Alerts';
import { getCookie } from '../common/Cookies';

const sendData = () => {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    const csrftoken = getCookie("csrftoken");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) location.replace(location.origin + '/');
            else if(this.status == 400) {
                const response = JSON.parse(this.responseText);
                alertError(response.error);
            } else console.log("Error occured!");
        } 
    };

    xmlHttp.open("POST", '/api/auth/login/');
    xmlHttp.setRequestHeader('X-CSRFToken', csrftoken);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify({ "username": username, "password": password }));
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Please write an essay about your favorite DOM element.'
        };

        this.validate = this.validate.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    validate(e) {
        e.preventDefault();
        sendData();
    }

    render() { 
        return (
            <div className="auth">
                <h2 className="text-center">Login</h2>
                <div className="alert alert-danger cust-alert" id="alert" role="alert"></div>
                <form noValidate autoComplete="off" onSubmit={this.validate}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="usrname" id="username" autoComplete="new-username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="passwd" id="password" autoComplete="new-password" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary material-btn auth-btn">Login</button>
                    </div>
                </form>
            </div>
        )
    }
}
