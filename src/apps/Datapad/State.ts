import { ShopId } from '../Shop';

// ---------- Action types ---------- \\
export const CHANGE_APP = 'CHANGE_APP';
export type CHANGE_APP = typeof CHANGE_APP;

export const CHANGE_SHOP = 'CHANGE_SHOP';
export type CHANGE_SHOP = typeof CHANGE_SHOP;

export const COLLAPSE_MENU = 'COLLAPSE_MENU';
export type COLLAPSE_MENU = typeof COLLAPSE_MENU;

export const EXPAND_MENU = 'EXPAND_MENU';
export type EXPAND_MENU = typeof EXPAND_MENU;

export interface ChangeApp {
	type: CHANGE_APP;
	newAppSelection: AppId;
}

export interface ChangeShop {
	type: CHANGE_SHOP;
	newShopSelection: ShopId;
}

export interface CollapseMenu {
	type: COLLAPSE_MENU;
}

export interface ExpandMenu {
	type: EXPAND_MENU;
}

export type DatapadActions = ChangeApp | ChangeShop | CollapseMenu | ExpandMenu;

/**
 * TODO
 */
export function changeApp(newAppSelection: AppId): ChangeApp {
	return {
		type: CHANGE_APP,
		newAppSelection,
	};
}

/**
 * TODO
 */
export function changeShop(newShopSelection: ShopId): ChangeShop {
	return {
		type: CHANGE_SHOP,
		newShopSelection,
	};
}

/**
 * TODO
 */
export function collapseMenu(): CollapseMenu {
	return {
		type: COLLAPSE_MENU,
	};
}

/**
 * TODO
 */
export function expandMenu(): ExpandMenu {
	return {
		type: EXPAND_MENU,
	};
}

// ---------- App State ---------- \\
export enum AppId {
	GalaxyMap,
	Shops,
	Contacts,
}

export interface AppState {
	appSelection: AppId;
	shopSelection: ShopId;
	collapseMenu: boolean;
}

export const initialState: AppState = {
	appSelection: AppId.GalaxyMap,
	shopSelection: ShopId.Equipment,
	collapseMenu: false,
};

/**
 * TODO: better name?
 * TODO: docs
 */
export default function datapadReducer(currentState: AppState, action: DatapadActions): AppState {
	switch (action.type) {
		case CHANGE_APP:
			return {
				...currentState,
				appSelection: action.newAppSelection,
			};
		case CHANGE_SHOP:
			return {
				...currentState,
				shopSelection: action.newShopSelection,
			};
		case COLLAPSE_MENU:
			return {
				...currentState,
				collapseMenu: true,
			};
		case EXPAND_MENU:
			return {
				...currentState,
				collapseMenu: false,
			};
		default:
			return currentState;
	}
}
