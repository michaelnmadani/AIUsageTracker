import type { CommandCentreAPI } from '../../preload/index';

/** The preload bridge — the renderer's only route to the outside world. */
export const api: CommandCentreAPI = window.commandCentre;
