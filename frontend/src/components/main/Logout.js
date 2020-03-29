import React, { Component } from 'react'
import { getCookie } from '../common/Cookies';
import Loading from '../common/Loading';
import rf from '../../modules/RestFetch';

const logout = () => {
    rf.post('/api/auth/logout/', {})
    .then(res => console.log(this.responseText))
    .catch(err => console.log(this.responseText))
    
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
