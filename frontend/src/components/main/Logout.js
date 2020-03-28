import React, { Component } from 'react'
import { getCookie } from '../common/Cookies';
import Loading from '../common/Loading';

const logout = () => {
    console.log("Logging out!");
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            console.log(this.responseText);
        }
    };
    xmlHttp.open("POST", "/api/auth/logout/", true);
    xmlHttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xmlHttp.send();
    location.replace(location.origin + '/auth/');
}

export default class Logout extends Component {
    render() {
        return (
            <div className="logout">
                <Loading />
                {logout()}
            </div>
        )
    }
}
