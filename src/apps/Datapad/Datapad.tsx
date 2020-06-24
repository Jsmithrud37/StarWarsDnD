import React, { ReactNode, useState } from 'react';
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
import GalaxyMap from '../GalaxyMap';
import Messenger from '../Messenger';
import { Shop, ShopId } from '../Shop/Shop';
import { Actions, changeApp, changeShop, collapseMenu, expandMenu } from './Actions';
import AppId from './AppId';
import { AppState } from './State';
import './Styling/Datapad.css';

const appId = 'datpad';
const viewId = 'datapad-view';
const menuId = 'datapad-menu';

const menuWidthInPixels = 225;

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
	const [viewWidth, setViewWidth] = useState(window.innerWidth);

	React.useEffect(() => {
		window.addEventListener('resize', () => {
			setViewWidth(window.innerWidth);
		});
	}, []);

	const appView: ReactNode = (
		<div className="Datapad-view" id={viewId}>
			{renderApp(props)}
		</div>
	);
	const menu = renderMenu(props);
	return (
		<div className="App">
			{renderHeader(props, viewWidth)}
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
function renderHeader(props: Props, viewWidthInPixels: number): ReactNode {
	return (
		<header className="App-header">
			{renderMenuBurgerButton(props, viewWidthInPixels)}
			<img
				className="App-header-logo"
				src="images/Order-Of-The-Fallen-Logo-Long.png"
				alt="Campaign logo"
			/>
		</header>
	);
}

/**
 * Renders the burger menu button that controls revealing and hiding the side menu,
 * which lives in the header above the menu.
 */
function renderMenuBurgerButton(props: Props, viewWidthInPixels: number): ReactNode {
	const buttonWidthInPixels = 25;
	const sliderWidthInPixels =
		Math.min(menuWidthInPixels, viewWidthInPixels / 4.3) - 1.75 * buttonWidthInPixels;

	return (
		<BurgerMenu
			width={`${sliderWidthInPixels}px`}
			onStateChange={(state) => {
				onMenuStateChange(props, state);
			}}
			isOpen={!props.isMenuCollapsed}
			disableOverlayClick={true}
			noOverlay={true}
			customBurgerIcon={false}
			customCrossIcon={false}
		>
			<HamburgerSqueeze
				className="App-header-burger-button"
				barColor="white"
				buttonWidth={`${buttonWidthInPixels}`}
				isActive={!props.isMenuCollapsed}
				toggleButton={
					props.isMenuCollapsed ? () => props.expandMenu() : () => props.collapseMenu()
				}
				buttonStyle={{
					left: `${sliderWidthInPixels}px`,
					top: '61px',
				}}
			/>
		</BurgerMenu>
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
		case AppId.Messenger:
			return <Messenger />;
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
	return (
		<BurgerMenu
			id={menuId}
			className="Datapad-app-menu"
			menuClassName="Datapad-app-menu-expanded"
			pageWrapId={viewId}
			outerContainerId={appId}
			width={`${menuWidthInPixels}px`}
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
					// TODO: update builders to take AppId and return it in onClick
					new SimpleAccordionMenuItemBuilder('Galaxy Map'),
					new CollapsableAccordionMenuItemBuilder('Shops', renderShopsSubMenu(props)),
					new SimpleAccordionMenuItemBuilder('Contacts'),
					new SimpleAccordionMenuItemBuilder('Messenger'),
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
