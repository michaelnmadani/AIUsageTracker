import React, { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { SceneController } from './pixi/SceneController';
import type { CatActivity } from '../../types/usage';

interface PixiSceneProps {
  activities: CatActivity[];
  isActive: boolean;
  celebrating: boolean;
}

/**
 * React wrapper for the PixiJS scene.
 * Bridges React props to the imperative SceneController.
 */
export const PixiScene: React.FC<PixiSceneProps> = ({ activities, isActive, celebrating }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const appRef = useRef<Application | null>(null);
  const prevCelebratingRef = useRef(false);

  // Latest props, so async setup can apply them once the controller is ready
  const latestPropsRef = useRef({ activities, isActive });
  latestPropsRef.current = { activities, isActive };

  // Initialize PixiJS application
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    const container = containerRef.current;

    const setup = async () => {
      const app = new Application();
      await app.init({
        background: 0xf3ddba,
        resizeTo: container,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      // Append the canvas
      container.appendChild(app.canvas);
      appRef.current = app;

      // Create and initialize the scene controller
      const controller = new SceneController(app);
      await controller.init();

      if (destroyed) {
        controller.destroy();
        app.destroy(true, { children: true });
        return;
      }

      controllerRef.current = controller;

      // Apply the props that arrived while the controller was initializing
      controller.setActivities(latestPropsRef.current.activities);
      controller.setActiveState(latestPropsRef.current.isActive);
    };

    setup();

    return () => {
      destroyed = true;
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
      // Clean up any remaining canvas elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // Bridge: activities
  useEffect(() => {
    controllerRef.current?.setActivities(activities);
  }, [activities]);

  // Bridge: active state
  useEffect(() => {
    controllerRef.current?.setActiveState(isActive);
  }, [isActive]);

  // Bridge: celebration (trigger on rising edge)
  useEffect(() => {
    if (celebrating && !prevCelebratingRef.current) {
      controllerRef.current?.triggerCelebration();
    }
    prevCelebratingRef.current = celebrating;
  }, [celebrating]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
        position: 'relative',
      }}
    />
  );
};
