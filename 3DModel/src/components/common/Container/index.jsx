import React from 'react'
import PropTypes from 'prop-types'
import './styled.css'

const Container = ({
  children,
  size = 'base',
  padding = 'base',
  margin = 'base',
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  className = ''
}) => {
  const sizeClass = `container--${size}`
  const paddingClass = `container--padding-${padding}`
  const marginClass = `container--margin-${margin}`

  const style = {
    display: 'flex',
    alignItems,
    justifyContent,
  }

  return (
    <div className={`container ${sizeClass} ${paddingClass} ${marginClass} ${className}`} style={style}>
      {children}
    </div>
  )
}

Container.defaultProps = {
  size: 'base',
  padding: 'base',
  margin: 'base',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  className: '',
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'base', 'medium', 'large', 'xlarge']),
  padding: PropTypes.oneOf(['small', 'base', 'medium', 'large', 'xlarge']),
  margin: PropTypes.oneOf(['small', 'base', 'medium', 'large', 'xlarge']),
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  justifyContent: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between', 'space-around']),
  className: PropTypes.string
}

export default Container
