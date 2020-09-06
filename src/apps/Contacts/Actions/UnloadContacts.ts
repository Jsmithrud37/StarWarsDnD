import { Contact } from '../Contact';

/**
 * Dispatch ID for the UnloadContacts action
 */
export const UNLOAD_CONTACTS = 'UNLOAD_CONTACTS';

/**
 * Typed dispatch ID for the UnloadContacts action
 */
export type UNLOAD_CONTACTS = typeof UNLOAD_CONTACTS;

/**
 * UnloadContacts action interface
 */
export interface UnloadContacts {
	type: UNLOAD_CONTACTS;
	contacts?: Contact[];
}

/**
 * UnloadContacts {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function unloadContacts(contacts?: Contact[]): UnloadContacts {
	return {
		type: UNLOAD_CONTACTS,
		contacts,
	};
}

/**
 * Unloads all contacts for the app.
 */
export type UnloadContactsFunction = (contacts?: Contact[]) => void;
