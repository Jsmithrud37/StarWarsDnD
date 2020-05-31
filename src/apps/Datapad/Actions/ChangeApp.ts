/**
 * ChangeApp action:
 * {@inheritdoc ChangeAppFunction}
 */

import AppId from '../AppId';

/**
 * Dispatch ID for the ChangeApp action
 */
export const CHANGE_APP = 'CHANGE_APP';

/**
 * Typed dispatch ID for the ChangeApp action
 */
export type CHANGE_APP = typeof CHANGE_APP;

/**
 * ChangeApp action interface
 */
export interface ChangeApp {
	type: CHANGE_APP;
	newAppSelection: AppId;
}

/**
 * ChangeApp {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function changeApp(newAppSelection: AppId): ChangeApp {
	return {
		type: CHANGE_APP,
		newAppSelection,
	};
}

/**
 * Changes the app selection to the new one specified.
 */
export type ChangeAppFunction = (newAppSelection: AppId) => void;
