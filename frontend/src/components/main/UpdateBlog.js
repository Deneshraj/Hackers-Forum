import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../common/Cookies';

export default class UpdateBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.blog.id,
            title: this.props.blog.title,
            content: this.props.blog.content
        };

        this.changeValues = this.changeValues.bind(this);
    }

    componentDidMount() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    changeValues(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    updateBlog = (e) => {
        e.preventDefault();
        let blog =  {
            id: this.state.id,
            title: this.state.title,
            content: this.state.content
        }
        const updateBlogInState = (updatedBlog) => {
            this.props.changeBlogInState(updatedBlog);
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                let response = JSON.parse(this.responseText);
                if(this.status == 201) {
                    updateBlogInState(response.msg);
                }
                else console.log(response); 
            }
        }

        xhttp.open('PUT', '/api/blogs/update/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhttp.send(JSON.stringify({ blog: blog }));
    }

    render() {
        return (
            <div className="add-form">
                <form onSubmit={this.updateBlog}>
                    <h2 className="text-center">Update Blog</h2>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" className="form-control" value={this.state.title} onChange={this.changeValues} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" name="content" className="form-control" value={this.state.content} onChange={this.changeValues}></textarea>
                    </div>

                    <button className="btn btn-primary">Update Blog</button>
                </form>
            </div>
        )
    }
}
