import React, { Component } from 'react'

export default class BlogBtns extends Component {
    constructor(props) {
        super(props);

        this.like = this.like.bind(this);
        this.share = this.share.bind(this);
        this.comment = this.comment.bind(this);
    }

    like() {
        console.log("Liking", this.props.id);
    }
    
    share() {
        console.log("Sharing ", this.props.id);
    }

    comment() {
        console.log("Commenting ", this.props.id);
    }

    render() {
        return (
            <div className="buttons row">
                <button className="blog-disp-btns like col-4" onClick={this.like}>Like</button>
                <button className="blog-disp-btns comment col-4" onClick={this.comment}>Comment</button>
                <button className="blog-disp-btns share col-4" onClick={this.share}>Share</button>
            </div>
        )
    }
}
