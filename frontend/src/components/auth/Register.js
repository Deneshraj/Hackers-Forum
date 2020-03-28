import React, { Component } from 'react';
import { getCookie } from '../common/Cookies';

const sendData = () => {
    var firstName = document.getElementById("first_name").value;
    var lastName = document.getElementById("last_name").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm_password").value;

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

    xmlHttp.open("POST", '/api/auth/register/');
    xmlHttp.setRequestHeader('X-CSRFToken', csrftoken);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify({
        "first_name": firstName,
        "last_name": lastName,
        "username": username,
        "email": email,
        "password": password,
        "confirm_password": confirmPassword
    }));
}

const alertError = (error) => {
    var alert = document.getElementById("alert");
    alert.innerHTML = error;
    alert.style.display = "block";
    alert.style.opacity = 1;

    setTimeout(() => {
        console.log("timeout1 before");
        var fadeEffect = setInterval(function () {
            if(!alert.style.opacity) {
                alert.style.opacity = 1;
            }
            if(alert.style.opacity > 0) {
                alert.style.opacity -= 0.1;
            } else {
                clearInterval(fadeEffect);
                alert.innerHTML = "";
                alert.style.display = "none";
                console.log("timeout1 after");
            }
        }, 60);
    }, 3000);
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Please write an essay about your favorite DOM element.'
        };

        this.validate = this.validate.bind(this);
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
                        <label htmlFor="first_name">First name</label>
                        <input type="text" className="form-control" name="first_name" id="first_name" autoComplete="new-fname" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last name</label>
                        <input type="text" className="form-control" name="last_name" id="last_name" autoComplete="new-lname" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="usrname" id="username" autoComplete="new-username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" name="email" id="email" autoComplete="new-username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="passwd" id="password" autoComplete="new-password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input type="password" className="form-control" name="confirm_passwd" id="confirm_password" autoComplete="new-confirmpassword" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary material-btn auth-btn">Login</button>
                    </div>
                </form>
            </div>
        )
    }
}
