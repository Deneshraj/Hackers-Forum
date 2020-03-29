import React, { Component } from 'react';
import AddBlog from './AddBlog';
import ViewBlogs from './ViewBlogs';
import { getCookie } from '../common/Cookies';
import UpdateBlog from './UpdateBlog';
import Loading from '../common/Loading';
import rf from '../../modules/RestFetch';

export default class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            errors: null,
            isError: false,
            modifyComponent: (<AddBlog fetchBlogs={this.fetchBlogs} />)
        }

        this.fetchBlogs = this.fetchBlogs.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.changeBlogInState = this.changeBlogInState.bind(this);
        this.fetchBlogs();
    }

    fetchBlogs = () => {
        const setNewState = (blogs) => {
            this.setState({ blogs: blogs })
        }

        rf.get('/api/blogs/user/')
        .then(blogs => setNewState(blogs))
        .catch(err => console.error(err))
    }

    changeBlogInState(updatedBlog) {
        this.setState({
            blogs: this.state.blogs.map((blog) => {
                if(blog.id === updatedBlog.id) {
                    return updatedBlog
                }
                return blog;
            }),
            modifyComponent: (<AddBlog fetchBlogs={this.fetchBlogs} />)
        });
        
    }

    updateBlog = (id) => {
        let blog = this.state.blogs.filter((blog) => blog.id === id)[0];
        this.setState({ modifyComponent: (<Loading />) });
        setTimeout(() => this.setState({ modifyComponent: (<UpdateBlog blog={blog} changeBlogInState={this.changeBlogInState.bind(this)}  />) }), 300);
    } 

    deleteBlog = (id) => {
        const removeBlogFromState = () => {
            this.setState({ blogs: this.state.blogs.filter((blog) => blog.id !== id) });
        }
        let data = JSON.stringify({ 'blog_id': id });
        rf.delete('/api/blogs/delete/', data)
        .then(msg => removeBlogFromState())
        .catch(err => console.error(err))
    }
    
    render() {
        return (
            <div>
                <h1 className="text-center bold">Welcome to Hacker's Forum!</h1>
                <div className="container">
                    {this.state.modifyComponent}
                    <ViewBlogs fetchBlogs={this.fetchBlogs} updateBlog={this.updateBlog} deleteBlog={this.deleteBlog} blogs={this.state.blogs} />
                </div>
            </div>
        )
    }
}