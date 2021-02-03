import { PlayerCharacter } from '../../../characters';

/**
 * Dispatch ID for the {@link LoadCharacters} action
 */
export const LOAD_CHARACTERS = 'LOAD_CHARACTERS';

/**
 * Typed dispatch ID for the {@link LoadCharacters} action
 */
export type LOAD_CHARACTERS = typeof LOAD_CHARACTERS;

/**
 * LoadContacts action interface
 */
export interface LoadCharacters {
	type: LOAD_CHARACTERS;
	characters?: PlayerCharacter[];
	initialCharacterSelection?: string;
}

/**
 * {@link LoadCharacters} {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function loadCharacters(
	characters?: PlayerCharacter[],
	initialCharacterSelection?: string,
): LoadCharacters {
	return {
		type: LOAD_CHARACTERS,
		characters,
		initialCharacterSelection,
	};
}

/**
 * Loads all player characters into the data store.
 */
export type LoadCharactersFunction = typeof loadCharacters;
