import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    toggleDetails = () => {
        this.setState(prevState => ({ showDetails: !prevState.showDetails }));
    };

    reportError = () => {
        console.log("Reporting error:", this.state.error);
        // In a real application, you would send this to a logging service
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Please try refreshing the page or contact support.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={this.toggleDetails}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                            >
                                {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                            </button>
                            <button
                                onClick={this.reportError}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Report
                            </button>
                        </div>
                        {this.state.showDetails && (
                            <div className="mt-6 p-4 bg-gray-200 dark:bg-gray-700 rounded text-left">
                                <h2 className="text-lg font-bold mb-2">Error Details:</h2>
                                <pre className="text-sm text-red-500 whitespace-pre-wrap">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
