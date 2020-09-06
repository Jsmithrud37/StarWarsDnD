import { Contact } from '../Contact';

/**
 * Dispatch ID for the LoadContacts action
 */
export const LOAD_CONTACTS = 'LOAD_CONTACTS';

/**
 * Typed dispatch ID for the LoadContacts action
 */
export type LOAD_CONTACTS = typeof LOAD_CONTACTS;

/**
 * LoadContacts action interface
 */
export interface LoadContacts {
	type: LOAD_CONTACTS;
	contacts?: Contact[];
}

/**
 * LoadContacts {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function loadContacts(contacts?: Contact[]): LoadContacts {
	return {
		type: LOAD_CONTACTS,
		contacts,
	};
}

/**
 * Loads all contacts for the app.
 */
export type LoadContactsFunction = (contacts?: Contact[]) => void;
