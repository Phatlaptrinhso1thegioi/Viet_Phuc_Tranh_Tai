import React, { useRef, useEffect } from 'react';
import { CharacterRenderer, CharacterDrawOptions } from '../engine/CharacterRenderer';

interface CharacterSpriteCanvasProps extends CharacterDrawOptions {
  width?: number;
  height?: number;
  className?: string;
}

export const CharacterSpriteCanvas: React.FC<CharacterSpriteCanvasProps> = ({
  characterClass = 'general_armor',
  gender = 'male',
  scale = 1.0,
  facing = 'right',
  action = 'idle',
  width = 120,
  height = 140,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      CharacterRenderer.drawCharacter(
        ctx,
        canvas.width / 2,
        canvas.height * 0.58,
        {
          characterClass,
          gender,
          scale,
          facing,
          action,
          tick,
        }
      );

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [characterClass, gender, scale, facing, action]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block pixel-art select-none ${className}`}
    />
  );
};
