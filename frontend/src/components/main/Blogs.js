import React, { Component } from 'react';
import AddBlog from './AddBlog';
import ViewBlogs from './ViewBlogs';
import { getCookie } from '../auth/Login';

export default class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            errors: null,
            isError: false
        }
        this.modifyComponent = (<AddBlog fetchBlogs={this.fetchBlogs} />);

        this.fetchBlogs = this.fetchBlogs.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.fetchBlogs();
    }

    fetchBlogs = () => {
        let xhttp = new XMLHttpRequest();
        var flag = false;
        const setNewState = (blogs) => {
            this.setState({ blogs: blogs })
        }
        
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    flag = true;
                    setNewState(JSON.parse(this.responseText));
                } else console.log(this.responseText)
            }
        }
        
        xhttp.open('GET', '/api/blogs/user/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
        xhttp.send();
    }

    updateBlog = (blog) => {
        const updateBlogInState = (updatedBlog) => {
            this.setState({
                blogs: this.state.blogs.map((blog) => {
                if(blog.id == id) {
                    return updatedBlog
                }
                return blog;
                }) 
            });
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                let response = JSON.parse(this.responseText);
                if(this.status == 201) {
                    // updateBlogInState(JSON.parse(this.responseText.blog));
                    console.log(response);
                }
                else console.log(response); 
            }
        }

        xhttp.open('PUT', '/api/blogs/update/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhttp.send(JSON.stringify({ blog: blog }));
    }

    deleteBlog = (id) => {
        const removeBlogFromState = () => {
            this.setState({ blogs: this.state.blogs.filter((blog) => blog.id !== id) });
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 201) removeBlogFromState();
                else console.log(this.responseText); 
            }
        }

        xhttp.open('DELETE', '/api/blogs/delete/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhttp.send(JSON.stringify({ 'blog_id': blogs.id, blogs }));
    }
    
    render() {
        return (
            <div>
                <h1 className="text-center bold">Welcome to Hacker's Forum!</h1>
                <div className="container">
                    {this.modifyComponent}
                    <ViewBlogs fetchBlogs={this.fetchBlogs} updateBlog={this.updateBlog} deleteBlog={this.deleteBlog} blogs={this.state.blogs} />
                </div>
            </div>
        )
    }
}