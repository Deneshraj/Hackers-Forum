import React, { Component } from 'react'

export default class Loading extends Component {
    render() {
        return (
            <div className="loading">
                <svg className="loading-svg">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
            </div>
        )
    }
}
