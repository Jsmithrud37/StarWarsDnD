/**
 * setPlayer action:
 * {@inheritdoc SetPlayerFunction}
 */

import { Player } from '../Player';

/**
 * Dispatch ID for the {@link SetPlayer} action
 */
export const SET_PLAYER = 'SET_PLAYER';

/**
 * Typed dispatch ID for the {@link SetPlayer} action
 */
export type SET_PLAYER = typeof SET_PLAYER;

/**
 * SetPlayer action interface
 */
export interface SetPlayer {
	type: SET_PLAYER;
	player: Player;
}

/**
 * {@link SetPlayer} {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function setPlayer(player: Player): SetPlayer {
	return {
		type: SET_PLAYER,
		player,
	};
}

/**
 * Sets the signed-in player
 */
export type SetPlayerFunction = (player: Player) => void;
