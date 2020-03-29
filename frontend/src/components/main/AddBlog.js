import React, { Component } from 'react';
import { getCookie } from '../common/Cookies';
import rf from '../../modules/RestFetch';

export default class AddBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: ""
        };

        this.changeValues = this.changeValues.bind(this);
        this.addBlog = this.addBlog.bind(this);
    }

    changeValues(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    addBlog(event) {
        event.preventDefault()
        const fetchUpdated = () => {
            this.setState({
                title: "",
                content: ""
            })
            this.props.fetchBlogs();
        }

        let strData = JSON.stringify({
            'title': this.state.title,
            "content": this.state.content
        });
        rf.post('/api/blogs/add/', strData)
        .then(response => fetchUpdated())
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="add-form">
                <form onSubmit={this.addBlog}>
                    <h2 className="text-center">Add Blog</h2>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" className="form-control" value={this.state.title} onChange={this.changeValues} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" name="content" className="form-control" value={this.state.content} onChange={this.changeValues}></textarea>
                    </div>

                    <button className="btn btn-primary">Add Blog</button>
                </form>
            </div>
        )
    }
}
