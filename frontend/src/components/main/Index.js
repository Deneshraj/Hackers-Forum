import React, { Component } from 'react';
import ViewBlogs from './ViewBlogs';
import { getCookie } from '../common/Cookies';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: []
        }
        this.fetchBlogs = this.fetchBlogs.bind(this);
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
        
        xhttp.open('GET', '/api/blogs/all/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
        xhttp.send();
    }

    render() {
        return (
            <div className="container">
                <ViewBlogs fetchBlogs={this.fetchBlogs.bind(this)} blogs={this.state.blogs} />
            </div>
        )
    }
}
