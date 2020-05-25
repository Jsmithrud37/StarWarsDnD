import React, { ReactNode } from 'react';
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

enum AppId {
	GalaxyMap,
	Shops,
	Contacts,
}

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

interface AppState {
	appSelection: AppId;
	shopSelection: ShopId;
	collapseMenu: boolean;
}

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
export default class Datapad extends React.Component<{}, AppState> {
	public constructor(props: {}) {
		super(props);
		this.state = {
			appSelection: AppId.GalaxyMap,
			shopSelection: ShopId.Equipment,
			collapseMenu: false,
		};
	}

	private changeApp(appSelection: AppId): void {
		this.setState({
			appSelection,
			shopSelection: this.state.shopSelection, // Do not change shop selection on app change
		});
	}

	private changeShop(shopSelection: ShopId): void {
		this.setState({
			// If a user manages to click on one of the sub-menus while the shops menu is animating shut,
			// switch back to shops menu
			appSelection: AppId.Shops,
			shopSelection,
		});
	}

	private collapseMenu(): void {
		this.setState({
			collapseMenu: true,
		});
	}

	private expandMenu(): void {
		this.setState({
			collapseMenu: false,
		});
	}

	private renderShopsSubMenu(): JSX.Element {
		return (
			<AccordionMenu
				initialSelectionIndex={this.state.shopSelection}
				onSelectionChange={(shopSelection: ShopId) => this.changeShop(shopSelection)}
				defaultItemStyle={menuItemStyleDefault}
				selectedItemStyle={menuItemStyleSelected}
				menuItemBuilders={[
					new SimpleAccordionMenuItemBuilder('Equipment'),
					new SimpleAccordionMenuItemBuilder('Apothicary'),
				]}
			/>
		);
	}

	private renderMenu(): ReactNode {
		if (this.state.collapseMenu) {
			return (
				<div className="Datapad-app-menu-collapsed">
					<div className="Datapad-app-menu-expand-button">
						<Button onClick={() => this.expandMenu()}>{'=>'}</Button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="Datapad-app-menu-expanded">
					<AccordionMenu
						initialSelectionIndex={this.state.appSelection}
						onSelectionChange={(appSelection: AppId) => this.changeApp(appSelection)}
						defaultItemStyle={menuItemStyleDefault}
						selectedItemStyle={menuItemStyleSelected}
						menuItemBuilders={[
							new SimpleAccordionMenuItemBuilder('Galaxy Map'),
							new CollapsableAccordionMenuItemBuilder(
								'Shops',
								this.renderShopsSubMenu(),
							),
							new SimpleAccordionMenuItemBuilder('Contacts'),
						]}
					/>
					<div className="Datapad-app-menu-collapse-button-container">
						<Button onClick={() => this.collapseMenu()}>{'<='}</Button>
					</div>
				</div>
			);
		}
	}

	private renderApp(): ReactNode {
		const selection = this.state.appSelection;
		switch (selection) {
			case AppId.GalaxyMap:
				return <GalaxyMap />;
			case AppId.Contacts:
				return <div>TODO: Contacts App</div>;
			case AppId.Shops:
				return <Shop shopSelection={this.state.shopSelection} />;
			default:
				throw new Error(`Unrecognized app selection: ${selection}`);
		}
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
}
