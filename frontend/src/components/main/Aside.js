import React, { Component } from 'react'

export default class Aside extends Component {
    render() {
        return (
            <div className="col-sm-3 aside col-md-hide">
                <aside>
                    <div className="aside-profile-pic-container">
                        <img src={this.props.profilePic} className="aside-profile-pic" />
                    </div>
                    <div className="aside-username">
                        <a href="#" className="aside-username-link">{this.props.username}</a>
                    </div>
                </aside>
            </div>
        )
    }
}
