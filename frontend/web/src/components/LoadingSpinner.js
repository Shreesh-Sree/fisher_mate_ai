import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const wave = keyframes`
  0%, 60%, 100% { transform: initial; }
  30% { transform: translateY(-15px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space.lg};
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
  background: ${props => props.overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  position: ${props => props.overlay ? 'fixed' : 'relative'};
  top: ${props => props.overlay ? '0' : 'auto'};
  left: ${props => props.overlay ? '0' : 'auto'};
  right: ${props => props.overlay ? '0' : 'auto'};
  bottom: ${props => props.overlay ? '0' : 'auto'};
  z-index: ${props => props.overlay ? props.theme.zIndices.modal : 'auto'};
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  margin-bottom: ${props => props.theme.space.md};
`;

// Classic spinner
const ClassicSpinner = styled.div`
  width: 100%;
  height: 100%;
  border: 4px solid ${props => props.theme.colors.borderLight};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Wave spinner
const WaveSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  
  .wave-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    animation: ${wave} 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

// Pulse spinner
const PulseSpinner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

// Ripple spinner
const RippleSpinner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 2px solid ${props => props.theme.colors.primary};
    animation: ${ripple} 2s linear infinite;
  }
  
  &:after {
    animation-delay: -1s;
  }
`;

// Fish spinner (custom themed)
const FishSpinner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  .fish-body {
    width: 60%;
    height: 40%;
    background: ${props => props.theme.colors.ocean};
    border-radius: 50% 0 50% 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${spin} 2s linear infinite;
    
    &:before {
      content: '';
      position: absolute;
      top: -20%;
      right: -10%;
      width: 40%;
      height: 60%;
      background: ${props => props.theme.colors.wave};
      clip-path: polygon(0 50%, 100% 0, 100% 100%);
    }
    
    &:after {
      content: '';
      position: absolute;
      top: 20%;
      left: 20%;
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
    }
  }
`;

// Boat spinner
const BoatSpinner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  .boat {
    width: 70%;
    height: 30%;
    background: ${props => props.theme.colors.primary};
    border-radius: 0 0 50% 50%;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${wave} 2s ease-in-out infinite;
    
    &:before {
      content: '';
      position: absolute;
      top: -80%;
      left: 30%;
      width: 2px;
      height: 80%;
      background: ${props => props.theme.colors.textPrimary};
    }
    
    &:after {
      content: '';
      position: absolute;
      top: -80%;
      left: 32%;
      width: 30%;
      height: 40%;
      background: ${props => props.theme.colors.coral};
      clip-path: polygon(0 0, 100% 50%, 0 100%);
    }
  }
  
  .waves {
    position: absolute;
    bottom: 20%;
    left: 0;
    right: 0;
    height: 10px;
    background: repeating-linear-gradient(
      90deg,
      ${props => props.theme.colors.wave} 0px,
      ${props => props.theme.colors.ocean} 20px,
      ${props => props.theme.colors.wave} 40px
    );
    animation: ${spin} 3s linear infinite;
  }
`;

const LoadingText = styled.div`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-top: ${props => props.theme.space.sm};
`;

const LoadingProgress = styled.div`
  width: 200px;
  height: 4px;
  background: ${props => props.theme.colors.borderLight};
  border-radius: 2px;
  margin-top: ${props => props.theme.space.md};
  overflow: hidden;
  
  .progress-bar {
    height: 100%;
    background: ${props => props.theme.colors.primary};
    border-radius: 2px;
    width: ${props => props.progress || 0}%;
    transition: width 0.3s ease;
  }
`;

const LoadingSpinner = ({ 
  type = 'classic', 
  size = '40px', 
  text = '', 
  fullScreen = false,
  overlay = false,
  progress = null,
  color = null 
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'wave':
        return (
          <WaveSpinner>
            <div className="wave-dot"></div>
            <div className="wave-dot"></div>
            <div className="wave-dot"></div>
          </WaveSpinner>
        );
      case 'pulse':
        return <PulseSpinner />;
      case 'ripple':
        return <RippleSpinner />;
      case 'fish':
        return (
          <FishSpinner>
            <div className="fish-body"></div>
          </FishSpinner>
        );
      case 'boat':
        return (
          <BoatSpinner>
            <div className="boat"></div>
            <div className="waves"></div>
          </BoatSpinner>
        );
      case 'classic':
      default:
        return <ClassicSpinner />;
    }
  };

  return (
    <SpinnerContainer fullScreen={fullScreen} overlay={overlay}>
      <SpinnerWrapper size={size}>
        {renderSpinner()}
      </SpinnerWrapper>
      
      {text && <LoadingText>{text}</LoadingText>}
      
      {progress !== null && (
        <LoadingProgress progress={progress}>
          <div className="progress-bar"></div>
        </LoadingProgress>
      )}
    </SpinnerContainer>
  );
};

// Additional utility components
export const InlineSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.colors.borderLight};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: ${props => props.theme.space.sm};
`;

export const ButtonSpinner = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: ${props => props.theme.space.xs};
`;

export const SkeletonLoader = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.borderLight} 25%,
    rgba(255, 255, 255, 0.5) 50%,
    ${props => props.theme.colors.borderLight} 75%
  );
  background-size: 200% 100%;
  animation: ${spin} 2s linear infinite;
  border-radius: ${props => props.theme.radii.md};
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.theme.space.xs} 0;
`;

export default LoadingSpinner;
