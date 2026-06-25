import { Component } from 'react'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hayError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hayError: true, error }
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary capturó:', error, info)
    }

    render() {
        if (this.state.hayError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
                    <p className="text-4xl font-bold text-neutral-200 mb-4">!</p>
                    <h2 className="text-lg font-semibold text-neutral-800 mb-2">Algo salió mal</h2>
                    <p className="text-sm text-neutral-500 mb-6">
                        Ocurrió un error inesperado. Intenta recargar la página.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-700 transition-colors"
                    >
                        Recargar
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}