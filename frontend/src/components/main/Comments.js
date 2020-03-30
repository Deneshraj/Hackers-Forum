import React, { Component } from 'react'
import rf from '../../modules/RestFetch';

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ""
        }

        this.changeComment = this.changeComment.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    addComment(e) {
        e.preventDefault();
        let data = {
            blog_id: this.props.blogId,
            comment: this.state.comment
        }

        const fetchComments = () => {
            this.setState({ comment: "" })
            if(this.props.fetchComments) this.props.fetchComments();
            document.getElementById("commentBtn").classList.remove("comment-active");
        }

        rf.post('/api/blogs/addcomment/', JSON.stringify(data))
        .then(res => fetchComments())
        .catch(err => console.error(err))
        document.getElementById(this.props.commentId).style.display = "none";

        console.log(this.props.fetchComments)
        
    }

    changeComment(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div className="comment-box" id={this.props.commentId}>
                <form onSubmit={this.addComment}>
                    <input className="comment-ip" placeholder="Enter your comments here!" onChange={this.changeComment} name="comment" value={this.state.comment} />
                    <button className="btn btn-primary comment-btn" type="submit">Comment</button>
                </form>
            </div>
        )
    }
}
