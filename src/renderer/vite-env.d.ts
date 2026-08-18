/// <reference types="vite/client" />

import type { CommandCentreAPI } from '../preload/index';

declare global {
  interface Window {
    commandCentre: CommandCentreAPI;
  }
}

declare module '*.css' {
  const content: string;
  export default content;
}

export {};
