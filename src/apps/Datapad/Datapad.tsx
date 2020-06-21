import React, { ReactNode } from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { slide as BurgerMenu, State as BurgerMenuState } from 'react-burger-menu';
import { connect } from 'react-redux';
import {
	AccordionMenu,
	AccordionMenuItemStyle,
	CollapsableAccordionMenuItemBuilder,
	SimpleAccordionMenuItemBuilder,
} from '../../shared-components/AccordionMenu';
import { Contacts } from '../Contacts';
import GalaxyMap from '../GalaxyMap/GalaxyMap';
import { Shop, ShopId } from '../Shop/Shop';
import { Actions, changeApp, changeShop, collapseMenu, expandMenu } from './Actions';
import AppId from './AppId';
import { AppState } from './State';
import './Styling/Datapad.css';

const appId = 'datpad';
const viewId = 'datapad-view';
const menuId = 'datapad-menu';

/**
 * Menu item style used for items which are not currently selected.
 */
const menuItemStyleDefault: AccordionMenuItemStyle = {
	backgroundColor: 'dark',
	textColor: 'light',
	borderColor: undefined,
};

/**
 * Menu item style used for selected items.
 */
const menuItemStyleSelected: AccordionMenuItemStyle = {
	backgroundColor: 'primary',
	textColor: 'light',
	borderColor: 'primary',
};

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Datapad {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
const DatapadComponent: React.FC<Props> = (props: Props) => {
	const appView: ReactNode = (
		<div className="Datapad-view" id={viewId}>
			{renderApp(props)}
		</div>
	);
	const menu = renderMenu(props);
	return (
		<div className="App">
			{renderHeader(props)}
			<div className="Datapad" id={appId}>
				{menu}
				{appView}
			</div>
		</div>
	);
};

/**
 * Renders the banner at the top of the app.
 */
function renderHeader(props: Props): ReactNode {
	return (
		<header className="App-header">
			<HamburgerSqueeze
				className="App-header-burger-button"
				barColor="white"
				buttonWidth="32"
				isActive={!props.isMenuCollapsed}
				toggleButton={
					props.isMenuCollapsed ? () => props.expandMenu() : () => props.collapseMenu()
				}
			/>
			<img
				className="App-header-logo"
				src="images/Order-Of-The-Fallen-Logo-Long.png"
				alt="Campaign logo"
			/>
		</header>
	);
}

/**
 * Renders the application view
 */
function renderApp(props: Props): ReactNode {
	const selection = props.appSelection;
	switch (selection) {
		case AppId.GalaxyMap:
			return <GalaxyMap />;
		case AppId.Contacts:
			return <Contacts />;
		case AppId.Shops:
			return <Shop shopSelection={props.shopSelection} />;
		default:
			throw new Error(`Unrecognized app selection: ${selection}`);
	}
}

/**
 * Function to be invoked by state-change on BurgerMenu implementation of Datapad menu.
 */
function onMenuStateChange(props: Props, menuState: BurgerMenuState): void {
	if (menuState.isOpen) {
		props.expandMenu();
	} else {
		props.collapseMenu();
	}
}

/**
 * Renders the Datapad main menu
 */
function renderMenu(props: Props): ReactNode {
	// const closeButton = <Button onClick={() => props.collapseMenu()}>{'<='}</Button>;

	return (
		<BurgerMenu
			id={menuId}
			className="Datapad-app-menu"
			menuClassName="Datapad-app-menu-expanded"
			pageWrapId={viewId}
			outerContainerId={appId}
			width="225px"
			onStateChange={(state) => {
				onMenuStateChange(props, state);
			}}
			isOpen={!props.isMenuCollapsed}
			disableOverlayClick={props.isMenuCollapsed}
			noOverlay={props.isMenuCollapsed}
			customBurgerIcon={false}
			customCrossIcon={false}
		>
			<AccordionMenu
				initialSelectionIndex={props.appSelection}
				onSelectionChange={(appSelection: AppId) => props.changeApp(appSelection)}
				defaultItemStyle={menuItemStyleDefault}
				selectedItemStyle={menuItemStyleSelected}
				menuItemBuilders={[
					new SimpleAccordionMenuItemBuilder('Galaxy Map'),
					new CollapsableAccordionMenuItemBuilder('Shops', renderShopsSubMenu(props)),
					new SimpleAccordionMenuItemBuilder('Contacts'),
				]}
			/>
		</BurgerMenu>
	);
}

/**
 * Renders the Shops sub-menu which appears under the "Shops" item in the main menu when selected.
 */
function renderShopsSubMenu(props: Props): JSX.Element {
	return (
		<AccordionMenu
			initialSelectionIndex={props.shopSelection}
			onSelectionChange={(shopSelection: ShopId) => props.changeShop(shopSelection)}
			defaultItemStyle={menuItemStyleDefault}
			selectedItemStyle={menuItemStyleSelected}
			menuItemBuilders={[
				new SimpleAccordionMenuItemBuilder('Equipment'),
				new SimpleAccordionMenuItemBuilder('Apothicary'),
			]}
		/>
	);
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return {
		appSelection: state.appSelection,
		shopSelection: state.shopSelection,
		isMenuCollapsed: state.isMenuCollapsed,
	};
}

/**
 * Datapad app.
 * Displays various sub-apps, and offers a menu for navigating them.
 */
const Datapad = connect(mapStateToProps, {
	changeApp,
	changeShop,
	collapseMenu,
	expandMenu,
})(DatapadComponent);

export default Datapad;
