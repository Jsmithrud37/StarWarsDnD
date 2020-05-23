import React, { ReactNode } from 'react';
import Accordion from 'react-bootstrap/accordion';
import Card from 'react-bootstrap/card';
import GalaxyMap from './GalaxyMap';
import './Datapad.css';
import { Shop, ShopId } from './Shop';

type CardColors = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | undefined;

enum AppId {
	GalaxyMap,
	Shops,
	Contacts,
}

type AppSelectionChangeFunction = (appSelection: AppId, appArguments: unknown) => void;

interface AppState {
	appSelection: AppId;
	appArguments: unknown;
}

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
export class Datapad extends React.Component<{}, AppState, any> {
	public constructor(props: {}) {
		super(props);
		this.state = {
			appSelection: AppId.GalaxyMap,
			appArguments: undefined,
		};
	}

	private changeApp(appSelection: AppId, appArguments: unknown = undefined): void {
		this.setState({
			appSelection,
			appArguments,
		});
	}

	public render() {
		return (
			<div className="Datapad">
				<Menu onSelectionChange={(a, b) => this.changeApp(a, b)} />
				<div className="Datapad-view">{this.renderApp()}</div>
			</div>
		);
	}

	private renderApp(): ReactNode {
		const selection = this.state.appSelection;
		switch (selection) {
			case AppId.GalaxyMap:
				return <GalaxyMap />;
			case AppId.Contacts:
				return <div>TODO: Contacts App</div>;
			case AppId.Shops:
				return <Shop shopId={this.state.appArguments as ShopId} />;
			default:
				throw new Error(`Unrecognized app selection: ${selection}`);
		}
	}
}

interface MenuState<TSelectionId extends number> {
	appSelection: TSelectionId;
	appArguments: unknown;
}

interface MenuProps {
	onSelectionChange: AppSelectionChangeFunction;
}

class Menu extends React.Component<MenuProps, MenuState<AppId>, any> {
	constructor(props: MenuProps) {
		super(props);
		this.state = {
			appSelection: AppId.GalaxyMap,
			appArguments: undefined,
		};
	}

	private setSelection(appSelection: AppId, appArguments: unknown) {
		this.setState({
			appSelection,
			appArguments,
		});
		this.props.onSelectionChange(appSelection, appArguments);
	}

	private isSelected(id: AppId): boolean {
		return id === this.state.appSelection;
	}

	render() {
		return (
			<Accordion className="Datapad-menu">
				<MenuItem
					title="Galaxy Map"
					id={AppId.GalaxyMap}
					isSelected={this.isSelected(AppId.GalaxyMap)}
					onClick={() => this.setSelection(AppId.GalaxyMap, undefined)}
				/>
				<CollapsableMenuItem
					title="Shops"
					id={AppId.Shops}
					isSelected={this.isSelected(AppId.Shops)}
					onClick={() => this.setSelection(AppId.Shops, undefined)} // TODO: set correct initial state?
					content={
						<InventorySubMenu
							onSelectionChange={appArguments => this.setSelection(AppId.Shops, appArguments)}
						/>
					}
				></CollapsableMenuItem>
				<MenuItem
					title="Contacts"
					id={AppId.Contacts}
					isSelected={this.isSelected(AppId.Contacts)}
					onClick={() => this.setSelection(AppId.Contacts, undefined)}
				/>
			</Accordion>
		);
	}
}

interface MenuItemParameters<TSelectionId extends number> {
	title: string;
	id: TSelectionId;
	isSelected: boolean;
	onClick: () => void;
}

class MenuItem<TSelectionId extends number> extends React.Component<MenuItemParameters<TSelectionId>> {
	public constructor(props: MenuItemParameters<TSelectionId>) {
		super(props);
	}

	private backgroundColor(): CardColors {
		return this.props.isSelected ? 'primary' : 'dark';
	}

	render() {
		return (
			<Card bg={this.backgroundColor()} text="light">
				<Accordion.Toggle
					as={Card.Header}
					eventKey={this.props.id.toString()}
					onClick={() => this.props.onClick()}
				>
					{this.props.title}
				</Accordion.Toggle>
			</Card>
		);
	}
}

interface CollapsableMenuItemParameters<TSelectionId extends number> extends MenuItemParameters<TSelectionId> {
	content: any; // TODO: sub-items
}

class CollapsableMenuItem<TSelectionId extends number> extends React.Component<
	CollapsableMenuItemParameters<TSelectionId>
> {
	public constructor(props: CollapsableMenuItemParameters<TSelectionId>) {
		super(props);
	}

	private backgroundColor(): CardColors {
		return this.props.isSelected ? 'primary' : 'dark';
	}

	render() {
		return (
			<Card bg={this.backgroundColor()} text="light">
				<Accordion.Toggle
					as={Card.Header}
					eventKey={this.props.id.toString()}
					onClick={() => this.props.onClick()}
				>
					{this.props.title}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={this.props.id.toString()}>
					<Card bg="dark" text="light">
						{this.props.content}
					</Card>
				</Accordion.Collapse>
			</Card>
		);
	}
}

interface InventoryMenuProps<TSelectionId extends number> {
	onSelectionChange: (selection: TSelectionId) => void;
}

class InventorySubMenu extends React.Component<InventoryMenuProps<ShopId>, MenuState<ShopId>, any> {
	public constructor(props: InventoryMenuProps<ShopId>) {
		super(props);
		this.state = {
			appSelection: ShopId.Equipment,
			appArguments: undefined,
		};
	}

	private setSelection(selection: ShopId) {
		this.setState({
			appSelection: selection,
		});
		this.props.onSelectionChange(selection);
	}

	private isSelected(id: ShopId): boolean {
		return id === this.state.appSelection;
	}

	render() {
		return (
			<Accordion>
				<MenuItem
					title="Equipment"
					id={ShopId.Equipment}
					isSelected={this.isSelected(ShopId.Equipment)}
					onClick={() => this.setSelection(ShopId.Equipment)}
				/>
				<MenuItem
					title="Apothicary"
					id={ShopId.Apothicary}
					isSelected={this.isSelected(ShopId.Apothicary)}
					onClick={() => this.setSelection(ShopId.Apothicary)}
				/>
			</Accordion>
		);
	}
}
