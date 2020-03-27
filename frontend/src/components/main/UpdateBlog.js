import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class UpdateBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: ""
        };

        this.changeValues = this.changeValues.bind(this);
    }

    changeValues(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    updateBlog() {
        this.props.updateBlog({
            title: this.state.title,
            content: this.state.content
        });
        
        <Redirect to="/blogs" />
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
