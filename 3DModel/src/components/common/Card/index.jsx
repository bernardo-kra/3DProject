import React from 'react'
import { Text, Button } from '@common'
import './styles.css'

const Card = ({ imageUrl, title, description, onView, onNavigate }) => {
    return (
        <div className="Card">
            <img src={imageUrl} alt={title} className="Card-image" />
            <Text element="h3" size="small" className="Card-title">{title}</Text>
            <Text element="p" size="xsmall" className="Card-description">{description}</Text>
            <div className="Card-buttons">
                <Button text="Visualizar" onClick={onView} />
                <Button text="Ver na Página" onClick={onNavigate} />
            </div>
        </div>
    )
}

export default Card
