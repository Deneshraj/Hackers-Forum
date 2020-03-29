import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../common/Cookies';
import rf from '../../modules/RestFetch';

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

        let data = JSON.stringify({ blog: blog })
        rf.put('/api/blogs/update/', data)
        .then(res => updateBlogInState(res.msg))
        .catch(err => console.log(err))
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
