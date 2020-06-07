import React, { ReactNode } from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import Button from 'react-bootstrap/Button';
import GalaxyMap from '../GalaxyMap/GalaxyMap';
import Shop, { reducers as shopReducers } from '../Shop';
import { Contacts } from '../Contacts';
import './Styling/Datapad.css';
import {
	AccordionMenu,
	AccordionMenuItemStyle,
	SimpleAccordionMenuItemBuilder,
} from '../../shared-components/AccordionMenu';
import { AppState } from './State';
import { changeApp, collapseMenu, expandMenu, Actions } from './Actions';
import AppId from './AppId';

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
class DatapadComponent extends React.Component<Props> {
	private readonly shopStore: never;

	public constructor(props: Props) {
		super(props);
		this.shopStore = createStore(shopReducers);
	}

	public render(): ReactNode {
		const appView: ReactNode = <div className="Datapad-view">{this.renderApp()}</div>;
		const menu = this.renderMenu();
		return (
			<div className="Datapad">
				{menu}
				{appView}
			</div>
		);
	}

	/**
	 * Renders the application view
	 */
	private renderApp(): ReactNode {
		const selection = this.props.appSelection;
		switch (selection) {
			case AppId.GalaxyMap:
				return <GalaxyMap />;
			case AppId.Contacts:
				return <Contacts />;
			case AppId.Shops:
				return (
					<Provider store={this.shopStore}>
						<Shop />
					</Provider>
				);
			default:
				throw new Error(`Unrecognized app selection: ${selection}`);
		}
	}

	/**
	 * Renders the Datapad main menu
	 */
	private renderMenu(): ReactNode {
		if (this.props.isMenuCollapsed) {
			return (
				<div className="Datapad-app-menu-collapsed">
					<div className="Datapad-app-menu-expand-button">
						<Button onClick={() => this.props.expandMenu()}>{'=>'}</Button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="Datapad-app-menu-expanded">
					<AccordionMenu
						initialSelectionIndex={this.props.appSelection}
						onSelectionChange={(appSelection: AppId) =>
							this.props.changeApp(appSelection)
						}
						defaultItemStyle={menuItemStyleDefault}
						selectedItemStyle={menuItemStyleSelected}
						menuItemBuilders={[
							new SimpleAccordionMenuItemBuilder('Galaxy Map'),
							new SimpleAccordionMenuItemBuilder('Shops'),
							new SimpleAccordionMenuItemBuilder('Contacts'),
						]}
					/>
					<div className="Datapad-app-menu-collapse-button-container">
						<Button onClick={() => this.props.collapseMenu()}>{'<='}</Button>
					</div>
				</div>
			);
		}
	}
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return {
		appSelection: state.appSelection,
		isMenuCollapsed: state.isMenuCollapsed,
	};
}

/**
 * Datapad app.
 * Displays various sub-apps, and offers a menu for navigating them.
 */
const Datapad = connect(mapStateToProps, {
	changeApp,
	collapseMenu,
	expandMenu,
})(DatapadComponent);

export default Datapad;
