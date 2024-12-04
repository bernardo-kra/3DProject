import React from "react"
import PropTypes from "prop-types"

const BKArchitectureLogo = ({ size = 90 }) => {
    const textSize = size * 0.8

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${size * 5} ${size * 2}`}
            width={size * 5}
            height={size * 2}
        >
            <text
                x={20}
                y={size * 0.9}
                fontSize={textSize}
                fontWeight="bold"
                fontFamily="Georgia, serif"
                fill="var(--text-color)"
            >
                Bk
            </text>
            <text
                x={20}
                y={size * 1.6}
                fontSize={textSize * 0.7}
                fontWeight="normal"
                fontFamily="Georgia, serif"
                fill="var(--text-color)"
            >
                Architecture
            </text>
        </svg>
    )
}

BKArchitectureLogo.propTypes = {
    size: PropTypes.number,
}

export default BKArchitectureLogo
