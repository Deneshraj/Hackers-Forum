import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './layout/Header';
import rf from '../modules/RestFetch';
import Profile from './main/Profile';
import MainRoute from './main/MainRoute';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            profilePic: ""
        }

        this.fetchUser = this.fetchUser.bind(this);
        this.fetchUser();
    }

    fetchUser() {
        const updateState = (username, profilePic) => this.setState({ username, profilePic })
        rf.get('/api/user/gufa/')
        .then(res => updateState(res.username, res.profilePic))
        .catch(err => console.error(err))
    }

    render() {
        return (
            <Router>
                <Header username={this.state.username} />
                <div className="container">
                    <Switch>
                        <Route exact path='/profile/:username' component={Profile} />
                        {/* <Route path="/" component={(props) => <MainRoute {...props} username={this.state.username} profilePic={this.state.profilePic} />} /> */}
                        <MainRoute username={this.state.username} profilePic={this.state.profilePic} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));