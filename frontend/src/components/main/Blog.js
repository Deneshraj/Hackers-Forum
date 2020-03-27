import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Blog extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.deleteBlog) {
            return (
                <div className="blog-container">
                    <h3 className="blog-heading">{this.props.blog.title}</h3>
                    <p className="blog-content">{this.props.blog.content}</p>
                    <div className="blog-btns">
                        <button onClick={this.props.updateBlog.bind(this, this.props.blog.id)} className="btn btn-success">Update</button>
                        <button className="btn btn-danger" onClick={this.props.deleteBlog.bind(this, this.props.blog.id)}>Delete</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="blog-container">
                    <h3 className="blog-heading">{this.props.blog.title}</h3>
                    <p className="blog-content">{this.props.blog.content}</p>
                </div>
            )
        }
    }
}
