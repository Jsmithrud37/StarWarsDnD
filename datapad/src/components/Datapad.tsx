import React from 'react';
import Accordion from 'react-bootstrap/accordion';
import Card from 'react-bootstrap/card';
import GalaxyMap from './GalaxyMap';
import './Datapad.css';

type CardColors = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | undefined;

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
const Datapad: React.FC = () => {
	return (
		<div className="Datapad">
			<Menu />
			<div className="Datapad-view">
				<GalaxyMap />
			</div>
		</div>
	);
};

const galaxyMapId = '0';
const shopsId = '1';
const contactsId = '2';

interface MenuState {
	selection: string;
}

class Menu extends React.Component<{}, MenuState, any> {
	constructor(props: {}) {
		super(props);
		this.state = {
			selection: galaxyMapId,
		};
	}

	private setSelection(id: string) {
		this.setState({
			selection: id,
		});
	}

	private isSelected(id: string): boolean {
		return id === this.state.selection;
	}

	private bgColor(id: string): CardColors {
		return this.isSelected(id) ? 'primary' : 'dark';
	}

	render() {
		return (
			<Accordion className="Datapad-menu">
				{/* <Card bg={this.bgColor(contactsId)} text="light">
					<Accordion.Toggle
						as={Card.Header}
						eventKey={contactsId}
						onClick={() => this.setSelection(contactsId)}
					>
						Contacts
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={contactsId}>
						<Card bg="dark" text="light">
							TODO
						</Card>
					</Accordion.Collapse>
				</Card> */}
				<MenuItem
					title="Galaxy Map"
					id={galaxyMapId}
					isSelected={this.isSelected(galaxyMapId)}
					onClick={() => this.setSelection(galaxyMapId)}
				/>
				<CollapsableMenuItem
					title="Shops"
					id={shopsId}
					isSelected={this.isSelected(contactsId)}
					onClick={() => this.setSelection(contactsId)}
					content={<InventorySubMenu />}
				></CollapsableMenuItem>
				<MenuItem
					title="Contacts"
					id={contactsId}
					isSelected={this.isSelected(shopsId)}
					onClick={() => this.setSelection(shopsId)}
				/>
			</Accordion>
		);
	}
}

interface MenuItemParameters {
	title: string;
	id: string;
	isSelected: boolean;
	onClick: () => void;
}

class MenuItem extends React.Component<MenuItemParameters> {
	public constructor(props: MenuItemParameters) {
		super(props);
	}

	private backgroundColor(): CardColors {
		return this.props.isSelected ? 'primary' : 'dark';
	}

	render() {
		return (
			<Card bg={this.backgroundColor()} text="light">
				<Accordion.Toggle as={Card.Header} eventKey={this.props.id} onClick={() => this.props.onClick()}>
					{this.props.title}
				</Accordion.Toggle>
			</Card>
		);
	}
}

interface CollapsableMenuItemParameters extends MenuItemParameters {
	content: any; // TODO: sub-items
}

class CollapsableMenuItem extends React.Component<CollapsableMenuItemParameters> {
	public constructor(props: CollapsableMenuItemParameters) {
		super(props);
	}

	private backgroundColor(): CardColors {
		return this.props.isSelected ? 'primary' : 'dark';
	}

	render() {
		return (
			<Card bg={this.backgroundColor()} text="light">
				<Accordion.Toggle as={Card.Header} eventKey={this.props.id} onClick={() => this.props.onClick()}>
					{this.props.title}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={this.props.id}>
					<Card bg="dark" text="light">
						{this.props.content}
					</Card>
				</Accordion.Collapse>
			</Card>
		);
	}
}

const equipmentId = '3';
const apothicaryId = '4';

class InventorySubMenu extends React.Component<{}, MenuState, any> {
	public constructor(props: {}) {
		super(props);
		this.state = {
			selection: equipmentId,
		};
	}

	private setSelection(id: string) {
		this.setState({
			selection: id,
		});
	}

	private isSelected(id: string): boolean {
		return id === this.state.selection;
	}

	render() {
		return (
			<Accordion>
				<MenuItem
					title="Equipment"
					id={equipmentId}
					isSelected={this.isSelected(equipmentId)}
					onClick={() => this.setSelection(equipmentId)}
				/>
				<MenuItem
					title="Apothicary"
					id={apothicaryId}
					isSelected={this.isSelected(apothicaryId)}
					onClick={() => this.setSelection(apothicaryId)}
				/>
			</Accordion>
		);
	}
}

export default Datapad;
