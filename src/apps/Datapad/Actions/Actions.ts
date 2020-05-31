import { ChangeApp, ChangeAppFunction } from './ChangeApp';
import { ChangeShop, ChangeShopFunction } from './ChangeShop';
import { CollapseMenu, CollapseMenuFunction } from './CollapseMenu';
import { ExpandMenu, ExpandMenuFunction } from './ExpandMenu';

/**
 * Collection of action interfaces used by the Datapad app component.
 */
export type DatapadActions = ChangeApp | ChangeShop | CollapseMenu | ExpandMenu;

/**
 * Collection of action functions supported by the Datapad app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc ChangeAppSignature}
	 */
	changeApp: ChangeAppFunction;

	/**
	 * {@inheritdoc ChangeShopFunction}
	 */
	changeShop: ChangeShopFunction;

	/**
	 * {@inheritdoc CollapseMenuFunction}
	 */
	collapseMenu: CollapseMenuFunction;

	/**
	 * {@inheritdoc ExpandMenuFunction}
	 */
	expandMenu: ExpandMenuFunction;
}
