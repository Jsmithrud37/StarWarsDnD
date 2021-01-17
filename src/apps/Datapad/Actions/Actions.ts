import { ChangeApp, ChangeAppFunction } from './ChangeApp';
import { CollapseMenu, CollapseMenuFunction } from './CollapseMenu';
import { ExpandMenu, ExpandMenuFunction } from './ExpandMenu';
import { SetPlayer, SetPlayerFunction } from './SetPlayer';

/**
 * Collection of action interfaces used by the Datapad app component.
 */
export type DatapadActions = ChangeApp | CollapseMenu | ExpandMenu | SetPlayer;

/**
 * Collection of action functions supported by the Datapad app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc ChangeAppFunction}
	 */
	changeApp: ChangeAppFunction;

	/**
	 * {@inheritdoc CollapseMenuFunction}
	 */
	collapseMenu: CollapseMenuFunction;

	/**
	 * {@inheritdoc ExpandMenuFunction}
	 */
	expandMenu: ExpandMenuFunction;

	/**
	 * {@inheritdoc ExpandMenuFunction}
	 */
	setPlayer: SetPlayerFunction;
}
