import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getCookie } from '../common/Cookies';
import rf from '../../modules/RestFetch';
import BlogBtns from './BlogBtns';

export default class Blog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            profilePic: "",
            createdAt: "",
        }

        this.fetchUser = this.fetchUser.bind(this);
        this.getDate = this.getDate.bind(this);
        this.redirectToURL = this.redirectToURL.bind(this);

        this.getDate();
        this.fetchUser();
    }

    getDate = () => {
        let date = this.props.blog.created_at.split("-")
        let created_time = this.props.blog.created_time.split(":")
        
        // new Date(Date.UTC(2020, 02, 29, 08, 38, 30, 712.096)) => Date Conversion!
        let time = new Date(Date.UTC(
            Number.parseInt(date[0]),
            Number.parseInt(date[1]) - 1,
            Number.parseInt(date[2]),
            Number.parseInt(created_time[0]),
            Number.parseInt(created_time[1]),
            Number.parseInt(created_time[2]),
        ))
        this.state.createdAt = time;
    }

    fetchUser() {
        const updateState = (username, profilePic) => this.setState({ username, profilePic })
        const data = JSON.stringify({ 'user_id': this.props.blog.user });
        rf.post('/api/user/fufb/', data)
        .then(res => updateState(res.username, res.profilePic))
        .catch(err => console.error(err))
    }

    redirectToURL(id) {
        location.href = "/blog/" + id;
    }

    render() {
        let displayText = "";
        const createdAt = this.state.createdAt;
        const dateNow = new Date()
        const yearDiff = dateNow.getFullYear() - createdAt.getFullYear();
        
        if(yearDiff > 1) displayText = yearDiff + " years ago."
        else if(yearDiff == 1) displayText = "1 year ago."
        else {
            const monthDiff = dateNow.getMonth() - createdAt.getMonth();
            if(monthDiff > 1) displayText = monthDiff + " months ago."
            else if(monthDiff == 1) displayText = "1 month ago"
            else {
                const dateDiff = dateNow.getDate() - createdAt.getDate();
                if(dateDiff > 1) displayText = dateDiff + " days ago."
                else if(dateDiff == 1) displayText = "1 day ago"
                else {
                    const hoursDiff = dateNow.getHours() - createdAt.getHours();
                    if(hoursDiff > 1) displayText = hoursDiff + " hours ago"
                    else if(hoursDiff == 1) displayText = "1 hour ago"
                    else {
                        const minuteDiff = dateNow.getMinutes() - dateNow.getMinutes();
                        if(minuteDiff > 1) displayText = minuteDiff + " minutes ago"
                        else if(minuteDiff == 1) displayText = "1 minute ago"
                        else {
                            console.log(this.state.createdAt, dateNow);
                            displayText = "A moment ago"
                        }
                    }
                }
            }
        }

        if(this.props.deleteBlog) {
            return (
                <div className="blog-container">
                    <div className="content-container" onClick={this.redirectToURL.bind(this, this.props.blog.id)}>
                        <h3 className="blog-heading">{this.props.blog.title}</h3>
                        <p className="blog-content">{this.props.blog.content}</p>
                    </div>
                    <BlogBtns id={this.props.blog.id} />
                    <div className="blog-btns row">
                        <button onClick={this.props.updateBlog.bind(this, this.props.blog.id)} className="btn btn-success col-sm-6">Update</button>
                        <button className="btn btn-danger col-sm-6" onClick={this.props.deleteBlog.bind(this, this.props.blog.id)}>Delete</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="blog-container">
                    <div className="content-container" onClick={this.redirectToURL.bind(this, this.props.blog.id)}>
                        <div className="blog-heading">
                            <div className="img-container">
                                <img src={this.state.profilePic} className="profile-pic" />
                            </div>
                            <div className="username-container">
                                <a className="username" href="#">{this.state.username}</a>
                                <span className="faded">{displayText}</span>
                            </div>
                        </div>
                        <h6 className="blog-title">{this.props.blog.title}</h6>
                        <p className="blog-content">{this.props.blog.content}</p>
                    </div>
                    <BlogBtns id={this.props.blog.id} />
                </div>
            )
        }
    }
}
