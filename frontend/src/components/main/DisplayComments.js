import React, { Component } from 'react'
import rf from '../../modules/RestFetch';
import Loading from '../common/Loading';
import Comment from './Comment';
import Comments from './Comments';

const noMoreComments = (
    <div className='view-form'>
        <h3 className='text-center'>No more Comments to show</h3>
    </div>
)
export default class DisplayComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            fetched: false
        }

        this.component = noMoreComments;
        this.fetchComments = this.fetchComments.bind(this);
        this.fetchComments();
    }

    fetchComments() {
        const data = {
            blog_id: this.props.blogId
        }

        const setComments = (comments) => {
            this.setState({
                comments: comments,
                fetched: true
            })
        }

        rf.post('/api/blogs/getcomments/', JSON.stringify(data))
        .then(res => setComments(res.msg))
        .catch(err => console.log(err))
    }

    render() {
        if(this.state.fetched) {
            if(this.state.comments.length <= 0) {
                this.component = noMoreComments;
            }
            else {
                this.component = this.state.comments.map(comment => {
                    return (<Comment key={comment.id} comment={comment} />)
                })
                
            }    
            return (
                <div>
                    <Comments blogId={this.props.blogId} commentId="commentSection" fetchComments={this.fetchComments.bind(this)} />
                    {this.component}
                </div>
            )
        } else {            
            return (
                <Loading />
            )
        }
    }
}
