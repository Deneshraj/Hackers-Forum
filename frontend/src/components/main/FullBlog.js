import React, { Component } from 'react'
import rf from '../../modules/RestFetch';
import BlogBtns from './BlogBtns';
import FullBlogBtn from './FullBlogBtn';
import Loading from '../common/Loading';
import DisplayComments from './DisplayComments';

export default class FullBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blog: {}
        }

        this.fetchBlog = this.fetchBlog.bind(this);
        this.fetchBlog();
        console.log(this.state.blog);
    }

    fetchBlog() {
        console.log("Fetching...");
        const setBlog = (blog) => {
            this.setState({ blog: blog })
        }
        rf.get(`/api/blogs/blog/?id=${this.props.match.params.id}`)
        .then(res => setBlog(res.blog))
        .catch(err => console.error(err))
    }

    render() {
        if(this.state.blog.id) {
            return (
                <div>
                    <div className="full-blog">
                        <div className="blog-content">
                            <h1 className="text-center">{this.state.blog.title}</h1>
                            <p className="content">{this.state.blog.content}</p>
                        </div>
                        <div className="likes-display-comments">
                            <span className="faded">{this.state.blog.likes_count} Likes</span>
                        </div>
                        <BlogBtns id={this.state.blog.id} commentId="commentSection" />
                    </div>
                    <DisplayComments blogId={this.state.blog.id} />
                </div>
            )
        } else return (<Loading />)
    }
}
