import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Checkbox = ({ label, checked, onChange, disabled, className }) => {
    return (
        <div className={`Checkbox ${className || ''}`}>
            <input
                type="checkbox"
                className="Checkbox-input"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                id="checkbox-id"
            />
            <label htmlFor="checkbox-id" className={`Checkbox-label ${disabled ? 'Checkbox-label-disabled' : ''}`}>
                {label}
            </label>
        </div>
    )
}

Checkbox.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
}

Checkbox.defaultProps = {
    label: '',
    disabled: false,
    className: '',
}

export default Checkbox
