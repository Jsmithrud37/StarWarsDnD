import { Reducer } from 'redux';
import { ContactsActionTypes, LOAD_CHARACTERS, SELECT_CHARACTER } from './Actions';
import { PlayerCharacter } from '../../characters';

/**
 * State utilized by the Contacts app component
 */
export interface AppState {
	/**
	 * Characters belonging to the signed-in character. Will be undefined initially, until loaded.
	 */
	characters?: PlayerCharacter[];

	/**
	 * ID of the currently selected Character, if one is selected.
	 * Will always be undefined if {@link contacts} is `undefined`.
	 */
	characterSelection?: string;
}

/**
 * Initial state used by the Contacts app component
 */
export const initialState: AppState = {
	characters: undefined, // Will be loaded asynchronously from the database
	characterSelection: undefined, // Selection can only be set after contacts have been loaded
};

/**
 * {@link https://redux.js.org/basics/reducers | Reducer} for the Contacts app component's state
 */
export const reducer: Reducer<AppState, ContactsActionTypes> = (
	currentState: AppState | undefined,
	action: ContactsActionTypes,
): AppState => {
	if (!currentState) {
		return initialState;
	}
	switch (action.type) {
		case LOAD_CHARACTERS:
			const characters = action.characters;
			const maybeSelectedCharacter = action.initialCharacterSelection;

			let characterSelection = characters ? characters[0]._id : undefined;
			if (maybeSelectedCharacter && characters) {
				for (const character of characters) {
					if (character.name === maybeSelectedCharacter) {
						characterSelection = character._id;
						break;
					}
				}
			}
			return {
				...currentState,
				characters,
				characterSelection,
			};
		case SELECT_CHARACTER:
			return {
				...currentState,
				characterSelection: action.selection,
			};
		default:
			return currentState;
	}
};
