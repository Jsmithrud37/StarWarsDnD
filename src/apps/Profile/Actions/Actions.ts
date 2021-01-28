import { LoadCharacters, LoadCharactersFunction } from './LoadCharacters';
import { SelectCharacter, SelectCharacterFunction } from './SelectCharacters';

/**
 * Collection of action interfaces used by the Contacts app component.
 */
export type ContactsActionTypes = SelectCharacter | LoadCharacters;

/**
 * Collection of action functions supported by the Contacts app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc LoadCharactersFunction}
	 */
	loadCharacters: LoadCharactersFunction;

	/**
	 * {@inheritdoc SelectCharacterFunction}
	 */
	selectCharacter: SelectCharacterFunction;
}
