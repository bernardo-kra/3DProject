import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, errorMessage: '' }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Erro capturado no ErrorBoundary:', error, errorInfo)
    }

    resetError = () => {
        this.setState({ hasError: false, errorMessage: '' })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Ocorreu um erro ao carregar o modelo.</h2>
                    <p>{this.state.errorMessage}</p>
                    <button onClick={this.resetError}>Tentar novamente</button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
