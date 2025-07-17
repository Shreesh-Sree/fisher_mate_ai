import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiMessageCircle } from 'react-icons/fi';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.space.xl};
  background: ${props => props.theme.colors.background};
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.danger};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.space.lg};
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const ErrorTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.space.md};
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.space.lg};
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: ${props => props.theme.space.lg};
  padding: ${props => props.theme.space.md};
  background: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.radii.lg};
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 800px;
  width: 100%;
  
  summary {
    font-weight: ${props => props.theme.fontWeights.medium};
    cursor: pointer;
    padding: ${props => props.theme.space.sm};
    color: ${props => props.theme.colors.textSecondary};
    
    &:hover {
      color: ${props => props.theme.colors.textPrimary};
    }
  }
  
  pre {
    background: ${props => props.theme.colors.dark};
    color: ${props => props.theme.colors.light};
    padding: ${props => props.theme.space.md};
    border-radius: ${props => props.theme.radii.md};
    overflow-x: auto;
    font-size: ${props => props.theme.fontSizes.sm};
    font-family: ${props => props.theme.fonts.monospace};
    margin-top: ${props => props.theme.space.md};
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.space.md};
  margin-top: ${props => props.theme.space.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  padding: ${props => props.theme.space.md} ${props => props.theme.space.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  border-radius: ${props => props.theme.radii.lg};
  border: 2px solid ${props => props.primary ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.textPrimary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.primary ? props.theme.colors.primaryHover : props.theme.colors.light};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}40;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorCode = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textMuted};
  margin-top: ${props => props.theme.space.sm};
  font-family: ${props => props.theme.fonts.monospace};
`;

const SuggestedActions = styled.div`
  margin-top: ${props => props.theme.space.xl};
  padding: ${props => props.theme.space.lg};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.radii.xl};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  max-width: 600px;
  width: 100%;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.lg};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: ${props => props.theme.space.md};
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: ${props => props.theme.space.sm} 0;
      color: ${props => props.theme.colors.textSecondary};
      
      &:before {
        content: "•";
        color: ${props => props.theme.colors.primary};
        margin-right: ${props => props.theme.space.sm};
      }
    }
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send error to monitoring service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      });
    }

    // Send to error reporting service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Create mailto link
    const subject = 'FisherMate Error Report';
    const body = `Error Report:\n\n${JSON.stringify(errorReport, null, 2)}`;
    const mailtoLink = `mailto:support@fishermate.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink);
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const errorName = this.state.error?.name || 'Error';
      
      return (
        <ErrorContainer>
          <ErrorIcon>
            <FiAlertTriangle />
          </ErrorIcon>
          
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          
          <ErrorMessage>
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
          </ErrorMessage>
          
          <ErrorCode>
            Error: {errorName} - {errorMessage}
          </ErrorCode>
          
          <ActionButtons>
            <ActionButton primary onClick={this.handleRetry}>
              <FiRefreshCw size={18} />
              Try Again
            </ActionButton>
            
            <ActionButton onClick={this.handleGoHome}>
              <FiHome size={18} />
              Go to Dashboard
            </ActionButton>
            
            <ActionButton onClick={this.handleReportError}>
              <FiMessageCircle size={18} />
              Report Error
            </ActionButton>
          </ActionButtons>
          
          <SuggestedActions>
            <h3>What you can do:</h3>
            <ul>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Clear your browser cache</li>
              <li>Try again in a few minutes</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </SuggestedActions>
          
          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <summary>Technical Details (Development Mode)</summary>
              <pre>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (Component, errorFallback) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  
  const resetError = () => setError(null);
  
  const handleError = (error) => {
    setError(error);
    console.error('Error handled:', error);
  };
  
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
  
  return { handleError, resetError };
};

// Simple error fallback component
export const SimpleErrorFallback = ({ error, resetError }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center', 
    background: '#f8d7da', 
    color: '#721c24',
    borderRadius: '8px',
    margin: '20px 0'
  }}>
    <h3>Something went wrong</h3>
    <p>{error?.message || 'An error occurred'}</p>
    <button 
      onClick={resetError}
      style={{
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px'
      }}
    >
      Try Again
    </button>
  </div>
);

export default ErrorBoundary;
