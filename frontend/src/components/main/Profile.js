import React, { Component } from 'react';
import Settings from './Settings';
import Blogs from './Blogs';
import rf from '../../modules/RestFetch';
import Blog from './Blog';
import Loading from '../common/Loading';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            blogs: [],
            profilePic: "",
            currentUser: null,
            friendRequested: false,
            componentMounted: false,
            fetched: false,
            friendRequestFrom: false,
            friendStatus: false
        }
        
        this.friendRequestFrom = false;
        this.friendRequested = false;

        this.fetchUser = this.fetchUser.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.fetchUser();
    }

    componentDidMount() {
        this.setState({ componentMounted: true });
    }

    fetchUser() {
        const setProfileState = (res) => {
            this.setState({
                user: res.msg,
                profilePic: res.profile_pic,
                blogs: res.blogs,
                currentUser: res.currentUser,
                friendRequested: res.friendRequested,
                fetched: true,
                friendRequestFrom: res.friendRequestFrom,
                friendStatus: res.friendStatus
            });

            this.friendRequestFrom = res.friendRequestFrom;
            this.friendRequested = res.friendRequested;
        }

        rf.post(`/api/user/gufp/`, JSON.stringify({ 'username': this.props.match.params.username }))
        .then(res => setProfileState(res))
        .catch(err => console.error(err))
    }

    sendFriendRequest() {
        console.log(this.state);
        const changeState = (res) => {
            if(res.friendStatus) this.setState({
                friendRequested: res.friendRequested,
                friendStatus: friendStatus
            });
            else this.setState({
                friendRequested: res.friendRequested,
            });
        }

        let data = {
            to_user: this.state.user.id
        }

        if(this.friendRequestFrom) {
            rf.post('/api/user/acceptfriendrequest/', JSON.stringify(data))
            .then(res => console.log(res))
            .catch(err => console.log(err))
        } else{
            rf.post('/api/user/addfriendrequest/', JSON.stringify())
            .then(res => changeState(res))
            .catch(err => console.error(err))
        }
    }

    render() {
        let blogNum = 0;
        let component = this.state.blogs.map((blog) => {
            return (<Blog blogNum={blogNum++} key={blog.id} blog={blog} />)
        });
        
        let likeButtonComponent = (<Loading />);
        let requestedText = (this.state.friendRequestFrom) ? "Accept Request" : "Add Friend Request";
        let buttonText = (this.state.friendRequested) ? "Cancel Request" : requestedText;

        if(!this.state.componentMounted) {
            likeButtonComponent = (<Loading />);
        } else {
            if(this.state.currentUser && this.state.currentUser === this.state.user.username)
                likeButtonComponent = null;
            else if(this.state.currentUser && (this.state.currentUser !== this.state.user.username))
                likeButtonComponent = (
                    <div className="profile-header-btn-container">
                        <button className="request" onClick={this.sendFriendRequest}>{buttonText}</button>
                    </div>
                );
        }

        if(!this.state.fetched) return (<Loading />)
        else return (
            <div className="profile">
                <div className="profile-header">
                    <div className="profile-header-container">
                        <img src={this.state.profilePic} className="profile-profilepic" />
                        <h1 className="profile-username">{this.state.user.username}</h1>
                        {likeButtonComponent}
                    </div>
                </div>
                <div className="profile-blogs">
                    {component}
                </div>
            </div>
        )
    }
}
