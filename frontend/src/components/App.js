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

export default class App extends Component {
    render() {
        return (
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route exact path="/blogs" component={Blogs} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/about" component={About} />
                    {/* Default Page Handling */}
                    <Route path="/" component={PageNotFound} />
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));