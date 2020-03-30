import React, { Component } from 'react'
import rf from '../../modules/RestFetch';

export default class BlogBtns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false
        }

        this.like = this.like.bind(this);
        this.share = this.share.bind(this);
        this.comment = this.comment.bind(this);
        this.isUserLiked = this.isUserLiked.bind(this);
        
        this.isUserLiked();
    }

    isUserLiked() {
        const setLiked = (res) => {
            this.setState({ liked: res.msg })
            console.log("UserLiked: ", res);
        }
        console.log(this.props.id)
        rf.post('/api/blogs/iulb/', JSON.stringify({ id: this.props.id }))
        .then(res => setLiked(res))
        .catch(err => console.error(err))
    }

    like() {
        const data = { id: this.props.id }
        const likeBlog = (res) => {
            this.setState({ liked: !this.state.liked })
        }
        rf.post('/api/blogs/likeblog/', JSON.stringify(data))
        .then(res => likeBlog(res))
        .catch(err => console.error(err))
    }
    
    share() {
        console.log("Sharing ", this.props.id);
    }

    comment(e) {
        let element = document.getElementById(this.props.commentId);
        if(element.style.display == "block") {
            element.style.display = "none";
            e.target.classList.remove("comment-active");
        } else {
            element.style.display = "block";
            e.target.classList.add("comment-active");
        }
    }

    render() {
        const likeBtn = !this.state.liked ? (<button className="blog-disp-btns like col-4" onClick={this.like}>Like</button>) : (<button className="blog-disp-btns like col-4 liked" onClick={this.like}>Disike</button>)
        return (
            <div className="btn-container">
                <div className="buttons row">
                    {likeBtn}
                    <button className="blog-disp-btns comment col-4" onClick={this.comment}>Comment</button>
                    <button className="blog-disp-btns share col-4" onClick={this.share}>Share</button>
                </div>
            </div>
        )
    }
}
