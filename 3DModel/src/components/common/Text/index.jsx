import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Text = ({
  element: Element = 'p',
  size = 'base',
  children,
  className = '',
  ...props
}) => {
  return (
    <Element className={`text text--${size} ${className}`} {...props}>
      {children}
    </Element>
  )
}

Text.propTypes = {
  element: PropTypes.oneOf([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'a', 'label', 'span', 'strong',
    'em', 'blockquote', 'div'
  ]),
  size: PropTypes.oneOf(['small', 'base', 'medium', 'large', 'xlarge']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default Text
