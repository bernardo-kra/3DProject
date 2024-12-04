import React from 'react'
import { Text, Button } from '@common'
import './styles.css'

const Card = ({ imageUrl, title, description, onView3D, onViewProject, onDelete }) => {
    return (
        <div className="Card">
            <img src={imageUrl} alt={title} className="Card-image" />
            <Text element="h3" size="small" className="Card-title">{title}</Text>
            <Text element="p" size="xsmall" className="Card-description">{description}</Text>
            <div className="Card-buttons">
                <Button text="Ver Projeto" onClick={onViewProject} />
                <Button text="Visualizar 3D" onClick={onView3D} />
                <Button text="Excluir" onClick={onDelete} />
            </div>
        </div>
    )
}

export default Card
