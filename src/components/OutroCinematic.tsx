import React from 'react';
import { CinematicVideoPlayer } from './CinematicVideoPlayer';

interface OutroCinematicProps {
  onComplete?: () => void;
  onBackToMenu?: () => void;
  videoUrl?: string;
}

export const OutroCinematic: React.FC<OutroCinematicProps> = ({ onComplete, onBackToMenu, videoUrl }) => {
  const handleDone = onComplete || onBackToMenu || (() => {});
  return (
    <CinematicVideoPlayer
      type="outro"
      onComplete={handleDone}
      videoUrl={videoUrl}
    />
  );
};
