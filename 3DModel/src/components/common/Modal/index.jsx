import { useState, useEffect } from 'react'
import { Button, Text } from '@common'
import './styles.css'

export default function Modal({ isOpen, onClose, title = "Título", children }) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    return (
        <>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <Text element="h1" size="large">{title}</Text>
                            <Button
                                text="&times;"
                                onClick={onClose}
                                className="modal-close"
                            />
                        </div>
                        <div className="modal-content">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
