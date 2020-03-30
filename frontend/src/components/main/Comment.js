import React, { Component } from 'react';
import rf from '../../modules/RestFetch';

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            profilePic: ""
        }

        this.fetchUser = this.fetchUser.bind(this);
        this.fetchUser();
    }

    fetchUser() {
        const updateState = (username, profilePic) => this.setState({ username, profilePic })
        const data = JSON.stringify({ 'user_id': this.props.comment.user });
        rf.post('/api/user/fufb/', data)
        .then(res => updateState(res.username, res.profilePic))
        .catch(err => console.error(err))
    }

    render() {
        return (
            <div className="comment-container">
                <div className="blog-heading">
                    <div className="img-container">
                        <img src={this.state.profilePic} className="profile-pic" />
                    </div>
                    <div className="username-container">
                        <a className="username" href="#">{this.state.username}</a>
                        <span className="faded">{this.props.comment.created_at}</span>
                    </div>
                </div>
                <div className="comments">
                    <p className="comment-text">{this.props.comment.comment}</p>
                </div>
            </div>
        )
    }
}
