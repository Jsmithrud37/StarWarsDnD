import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import GalaxyMap from '../GalaxyMap/GalaxyMap';
import { Shop, ShopId } from '../Shop/Shop';
import './Datapad.css';
import {
	AccordionMenu,
	AccordionMenuItemStyle,
	SimpleAccordionMenuItemBuilder,
	CollapsableAccordionMenuItemBuilder,
} from '../../shared-components/AccordionMenu';
import Button from 'react-bootstrap/Button';
import { AppId, changeApp, changeShop, collapseMenu, expandMenu, AppState } from './State';

const menuItemStyleDefault: AccordionMenuItemStyle = {
	backgroundColor: 'dark',
	textColor: 'light',
	borderColor: undefined,
};

const menuItemStyleSelected: AccordionMenuItemStyle = {
	backgroundColor: 'primary',
	textColor: 'light',
	borderColor: 'primary',
};

interface Actions {
	changeApp: (newAppSelection: AppId) => void;
	changeShop: (newShopSelection: ShopId) => void;
	collapseMenu: () => void;
	expandMenu: () => void;
}

type Parameters = AppState;

type Props = Actions & Parameters;

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
const DatapadComponent: React.FC<Props> = (props: Props) => {
	const appView: ReactNode = <div className="Datapad-view">{renderApp(props)}</div>;
	const menu = renderMenu(props);
	return (
		<div className="Datapad">
			{menu}
			{appView}
		</div>
	);
};

/**
 * Renders the application view
 */
function renderApp(props: Props): ReactNode {
	const selection = props.appSelection;
	switch (selection) {
		case AppId.GalaxyMap:
			return <GalaxyMap />;
		case AppId.Contacts:
			return <div>TODO: Contacts App</div>;
		case AppId.Shops:
			return <Shop shopSelection={props.shopSelection} />;
		default:
			throw new Error(`Unrecognized app selection: ${selection}`);
	}
}

/**
 * Renders the Datapad main menu
 */
function renderMenu(props: Props): ReactNode {
	if (props.isMenuCollapsed) {
		return (
			<div className="Datapad-app-menu-collapsed">
				<div className="Datapad-app-menu-expand-button">
					<Button onClick={() => props.expandMenu()}>{'=>'}</Button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="Datapad-app-menu-expanded">
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
				<div className="Datapad-app-menu-collapse-button-container">
					<Button onClick={() => props.collapseMenu()}>{'<='}</Button>
				</div>
			</div>
		);
	}
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

const Datapad = connect(mapStateToProps, {
	changeApp,
	changeShop,
	collapseMenu,
	expandMenu,
})(DatapadComponent);

export default Datapad;
