import React from 'react';
import { RoomDefs, RoomFloor, RoomWalls, RoomFurniture, RoomDecor } from './room';

/**
 * Top-down room interior (no roof).
 * Viewed from directly above, showing the full floor plan with
 * detailed furniture, decorations, and warm ambient lighting.
 */
export const House: React.FC = () => (
  <g>
    <RoomDefs />
    <RoomFloor />
    <RoomWalls />
    <RoomFurniture />
    <RoomDecor />
  </g>
);
