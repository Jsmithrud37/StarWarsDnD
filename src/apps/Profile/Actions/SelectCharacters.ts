import { Id } from '../../../utilities/DatabaseUtilities';

/**
 * Dispatch ID for the {@link SelectCharacter} action
 */
export const SELECT_CHARACTER = 'SELECT_CHARACTER';

/**
 * Typed dispatch ID for the {@link SelectCharacter} action
 */
export type SELECT_CHARACTER = typeof SELECT_CHARACTER;

/**
 * Select Character action interface
 */
export interface SelectCharacter {
	type: SELECT_CHARACTER;
	selection: Id;
}

/**
 * {@link SelectCharacter} {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function selectCharacter(selection: Id): SelectCharacter {
	return {
		type: SELECT_CHARACTER,
		selection,
	};
}

/**
 * Set's the Profile app's character selection
 */
export type SelectCharacterFunction = (selection: Id) => void;
