import React from 'react';
import { CinematicVideoPlayer } from './CinematicVideoPlayer';

interface IntroCinematicProps {
  onComplete: () => void;
  videoUrl?: string;
}

export const IntroCinematic: React.FC<IntroCinematicProps> = ({ onComplete, videoUrl }) => {
  return (
    <CinematicVideoPlayer
      type="intro"
      onComplete={onComplete}
      videoUrl={videoUrl}
    />
  );
};
