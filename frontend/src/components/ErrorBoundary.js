import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo); // for now
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-4">
          <h1 className="text-2xl py-2 text-gray-900">Something went wrong</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-600 underline">
            Click here
          </Link>{' '}
          <p>to go back to the home page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
