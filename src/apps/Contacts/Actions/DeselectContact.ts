/**
 * Dispatch ID for the DeselectContact action
 */
export const DESELECT_CONTACT = 'DESELECT_CONTACT';

/**
 * Typed dispatch ID for the DeselectContact action
 */
export type DESELECT_CONTACT = typeof DESELECT_CONTACT;

/**
 * DeselectContact action interface
 */
export interface DeselectContact {
	type: DESELECT_CONTACT;
}

/**
 * DeselectContact {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function deselectContact(): DeselectContact {
	return {
		type: DESELECT_CONTACT,
	};
}

/**
 * Deselects any selected contact.
 */
export type DeselectContactFunction = () => void;
