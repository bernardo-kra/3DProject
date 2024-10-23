import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Input = ({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    className = '',
    ...props
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`custom-input ${className}`}
            {...props}
        />
    )
}

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
}

export default Input
