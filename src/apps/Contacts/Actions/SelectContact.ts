import { Id } from '../../../utilities/DatabaseUtilities';

/**
 * Dispatch ID for the ChangeContactSelection action
 */
export const SELECT_CONTACT = 'SELECT_CONTACT';

/**
 * Typed dispatch ID for the ChangeContactSelection action
 */
export type SELECT_CONTACT = typeof SELECT_CONTACT;

/**
 * ChangeContactSelection action interface
 */
export interface SelectContact {
	type: SELECT_CONTACT;
	selection: Id;
}

/**
 * ChangeContactSelection {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function selectContact(selection: Id): SelectContact {
	return {
		type: SELECT_CONTACT,
		selection,
	};
}

/**
 * Set's the Contacts app's contact selection to the one specified.
 */
export type SelectContactFunction = (selection: Id) => void;
