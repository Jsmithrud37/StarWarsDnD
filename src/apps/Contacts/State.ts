import { Reducer } from 'redux';
import { ContactsActionTypes, DESELECT_CONTACT, LOAD_CONTACTS, SELECT_CONTACT } from './Actions';
import { Contact } from './Contact';

/**
 * State utilized by the Contacts app component
 */
export interface AppState {
	/**
	 * Contacts to be displayed. Will be undefined initially, until loaded.
	 */
	contacts?: Contact[];

	/**
	 * Id of the currently selected Contact, if one is selected.
	 * Will always be undefined if {@link contacts} is `undefined`.
	 */
	contactSelection?: string;
}

/**
 * Initial state used by the Contacts app component
 */
export const initialState: AppState = {
	contacts: undefined, // Will be loaded asynchronously from the database
	contactSelection: undefined, // Selection can only be set after contacts have been loaded
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
		case LOAD_CONTACTS:
			return {
				...currentState,
				contacts: action.contacts,
			};
		case SELECT_CONTACT:
			return {
				...currentState,
				contactSelection: action.selection,
			};
		case DESELECT_CONTACT:
			return {
				...currentState,
				contactSelection: undefined,
			};
		default:
			return currentState;
	}
};
