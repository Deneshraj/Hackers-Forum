import React, { Component } from 'react';
import AddBlog from './AddBlog';
import ViewBlogs from './ViewBlogs';
import { getCookie } from '../common/Cookies';
import UpdateBlog from './UpdateBlog';
import Loading from '../common/Loading';

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
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 201) removeBlogFromState();
                else console.log(this.responseText); 
            }
        }

        xhttp.open('DELETE', '/api/blogs/delete/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhttp.send(JSON.stringify({ 'blog_id': id }));
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