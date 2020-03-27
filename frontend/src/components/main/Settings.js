import React, { Component } from 'react';
import { getCookie } from '../auth/Login';
import Loading from '../common/Loading';
import { alertError } from '../auth/Login'; 

export const alertMessage = (msg) => {
    var alert = document.getElementById("successAlert");
    alert.innerHTML = msg;
    alert.style.display = "block";
    alert.style.opacity = 1;

    setTimeout(() => {
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
            }
        }, 60);
    }, 3000);
}

export default class Settings extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            email: ''
        }

        this.fetchUser = this.fetchUser.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.fetchUser();
    }

    fetchUser = () => {
        var xhttp = new XMLHttpRequest();
        const setUserState = (user) => {
            this.setState({
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                email: user.email,
                active: true
            });
        }

        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 201) setUserState(JSON.parse(this.responseText).msg)
                else console.log(this.responseText)
            }
        }

        xhttp.open('POST', 'api/user/getuser/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhttp.send()
    }

    updateUser = (e) => {
        e.preventDefault();
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                const response = JSON.parse(this.responseText);
                if(this.status == 201) alertMessage(response.msg);
                else alertError(response.error);
            }
        }

        xhttp.open('PUT', 'api/user/update/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        const data = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            username: this.state.username,
            email: this.state.email
        }
        xhttp.send(JSON.stringify(data));
        e.preventDefault();
    }

    updateState = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    render() {
        let component;
        if(this.state.active) 
        component = (
            <div className="user">
                <div className="alert alert-success cust-alert" id="successAlert" role="alert"></div>
                <div className="alert alert-danger cust-alert" id="alert" role="alert"></div>
                <form onSubmit={this.updateUser} className="user-form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" name="first_name" id="firstName" value={this.state.firstName} onChange={this.updateState} />
                    </div>  
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" name="last_name" id="lastName" value={this.state.lastName} onChange={this.updateState} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" id="username" value={this.state.username} onChange={this.updateState} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" name="email" id="email" value={this.state.email} onChange={this.updateState} />
                    </div>

                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        )
        else component = (<Loading />)

        return (
            <div className="settings">
                <h1 className="text-center">Settings</h1>
                {component}
            </div>
        )
    }
}
