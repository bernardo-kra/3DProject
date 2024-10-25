import React from 'react'
import './styled.css'

const Loading = ({ isLoading }) => {

    if (!isLoading) return null

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            {/* <p>Carregando...</p> */}
        </div>
    )
}

export default Loading
