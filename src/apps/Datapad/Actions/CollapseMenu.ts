/**
 * CollapseMenu action:
 * {@inheritdoc CollapseMenuFunction}
 */

/**
 * Dispatch ID for the CollapseMenu action
 */
export const COLLAPSE_MENU = 'COLLAPSE_MENU';

/**
 * Typed dispatch ID for the CollapseMenu action
 */
export type COLLAPSE_MENU = typeof COLLAPSE_MENU;

/**
 * ChangeShop action interface
 */
export interface CollapseMenu {
	type: COLLAPSE_MENU;
}

/**
 * CollapseMenu {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function collapseMenu(): CollapseMenu {
	return {
		type: COLLAPSE_MENU,
	};
}

/**
 * Collapses the menu, if currently expanded. Otherwise, no-op.
 */
export type CollapseMenuFunction = () => void;
