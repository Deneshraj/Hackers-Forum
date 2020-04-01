import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Blogs from './Blogs';
import PageNotFound from '../PageNotFound';
import Logout from './Logout';
import Index from './Index';
import Settings from './Settings';
import About from './About';
import FullBlog from './FullBlog';
import Aside from './Aside';
import rf from '../../modules/RestFetch';

export default class MainRoute extends Component {
    render() {
        return (
            <div className="row">
                <Aside username={this.props.username} profilePic={this.props.profilePic} />
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
        )
    }
}
