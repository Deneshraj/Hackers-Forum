import React, { Component } from 'react';
import { getCookie } from '../common/Cookies';

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
        let xmlHttp = new XMLHttpRequest();
        const fetchUpdated = () => {
            this.setState({
                title: "",
                content: ""
            })
            this.props.fetchBlogs();
        }
        xmlHttp.onreadystatechange = function() {
            if(this.readyState == 4){
                if(this.status == 201) fetchUpdated();
                else if(this.status == 400) console.log(this.responseText);
                else if(this.status == 500) console.log(this.responseText);
                else console.log(this.responseText);
            }
        }

        xmlHttp.open('POST', '/api/blogs/add/', true);
        xmlHttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xmlHttp.send(JSON.stringify({ 'title': this.state.title, "content": this.state.content }));
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
