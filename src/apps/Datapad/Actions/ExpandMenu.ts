/**
 * ExpandMenu action:
 * {@inheritdoc ExpandMenuFunction}
 */

/**
 * Dispatch ID for the ExpandMenu action
 */
export const EXPAND_MENU = 'EXPAND_MENU';

/**
 * Typed dispatch ID for the ExpandMenu action
 */
export type EXPAND_MENU = typeof EXPAND_MENU;

/**
 * ExpandMenu action interface
 */
export interface ExpandMenu {
	type: EXPAND_MENU;
}

/**
 * ExpandMenu {@link https://redux.js.org/basics/actions#action-creators | Action Creator}
 */
export function expandMenu(): ExpandMenu {
	return {
		type: EXPAND_MENU,
	};
}

/**
 * Expands the menu, if currently collapsed. Otherwise, no-op.
 */
export type ExpandMenuFunction = () => void;
