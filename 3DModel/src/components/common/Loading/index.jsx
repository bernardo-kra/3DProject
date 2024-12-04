import React from 'react'
import './styled.css'

const Loading = ({ isLoading }) => {

    if (!isLoading) return null

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
        </div>
    )
}

export default Loading
