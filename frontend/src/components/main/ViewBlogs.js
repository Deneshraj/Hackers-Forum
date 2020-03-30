import React, { Component } from 'react'
import Blog from './Blog';
import Loading from '../common/Loading';

const noMorePosts = (
    <div className='view-form'>
        <h3 className='text-center'>No more posts to show</h3>
    </div>
)

const loadingComponent = (
    <div className='view-form'>
        <Loading />
    </div>
)

export default class ViewBlogs extends Component {
    constructor(props) {
        super(props);
        this.component = loadingComponent;
    }

    componentDidUpdate(prevProps) {
        if(this.props.blogs.length == 0) this.component == noMorePosts;

        if((prevProps.blogs == this.props.blogs) && (prevProps.blogs.length == 0)) {
            this.component = noMorePosts;
        }

        if(prevProps.blogs != this.props.blog) {
            this.render();
        }
    }

    render() {
        if(this.props.blogs.length > 0) {
            let blogNum = 0;
            this.component = this.props.blogs.map((blog) => {
                if(blog.content.length > 300) blog.content = blog.content.substring(0, 300) + "..."
                if(this.props.deleteBlog) return (
                    <Blog blogNum={blogNum++} deleteBlog={this.props.deleteBlog} updateBlog={this.props.updateBlog} key={blog.id} blog={blog} />
                    )
                else {
                    return (
                    <Blog blogNum={blogNum++} key={blog.id} blog={blog} />
                    )
                }
            });
        } else this.component = noMorePosts;

        return this.component;
    }
}
