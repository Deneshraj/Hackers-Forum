import React, { Component } from 'react'
import rf from '../../modules/RestFetch';
import BlogBtns from './BlogBtns';

export default class FullBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: {}
        }

        this.fetchBlog = this.fetchBlog.bind(this);
        this.fetchBlog();
    }

    fetchBlog() {
        let data = {
            "id": this.props.match.params.id
        }
        rf.get(`/api/blogs/blog/?id=${this.props.match.params.id}`)
        .then(res => this.setState({ blog: res.blog }))
        .catch(err => console.error(err))
    }

    render() {
        return (
            <div className="full-blog">
                <div className="blog-content">
                    <h1 className="text-center">{this.state.blog.title}</h1>
                    <p className="content">{this.state.blog.content}</p>
                </div>
                <BlogBtns id={this.state.blog.id} />
            </div>
        )
    }
}
