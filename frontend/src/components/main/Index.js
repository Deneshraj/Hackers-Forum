import React, { Component } from 'react';
import ViewBlogs from './ViewBlogs';
import { getCookie } from '../common/Cookies';
import rf from '../../modules/RestFetch';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: []
        }
        this.fetchBlogs = this.fetchBlogs.bind(this);
        this.fetchBlogs();
    }

    fetchBlogs = () => {
        const setNewState = (blogs) => {
            this.setState({ blogs: blogs })
        }
        
        rf.get('/api/blogs/all/')
        .then(blogs => setNewState(blogs))
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="container">
                <ViewBlogs fetchBlogs={this.fetchBlogs.bind(this)} blogs={this.state.blogs} />
            </div>
        )
    }
}
