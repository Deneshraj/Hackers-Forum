import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Blogs from './main/Blogs';
import PageNotFound from './PageNotFound';
import Header from './layout/Header';
import Logout from './main/Logout';
import Index from './main/Index';
import Settings from './main/Settings';
import About from './main/About';
import UpdateBlog from './main/UpdateBlog';
import FullBlog from './main/FullBlog';
import Aside from './main/Aside';
import rf from '../modules/RestFetch';

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
                <Header />
                <div className="container">
                    <div className="row">
                        <Aside username={this.state.username} profilePic={this.state.profilePic} />
                        <div className="col-sm-8 containers">
                            <Switch>
                                <Route exact path="/" component={Index} />
                                <Route exact path="/blogs" component={Blogs} />
                                <Route exact path="/settings" component={Settings} />
                                <Route exact path="/logout" component={Logout} />
                                <Route exact path="/about" component={About} />
                                <Route exact path='/blog/:id' component={FullBlog} />
                                {/* Default Page Handling */}
                                <Route path="/" component={PageNotFound} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));