import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Auth from './auth/Auth';
import PageNotFound from './PageNotFound';

class AuthComponent extends Component {
    render() {
        return (
            <Router>
               <Switch>
                   <Route exact path="/auth/login/" component={Login} />
                   <Route exact path="/auth/register/" component={Register} />
                   <Route exact path="/auth/" component={Auth} />
                   <Route path="/" component={PageNotFound} />
               </Switch>
            </Router>
        )
    }
}

ReactDOM.render(<AuthComponent />, document.getElementById("auth"))
export default AuthComponent;