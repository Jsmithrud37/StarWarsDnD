import React from 'react';
import Accordion from 'react-bootstrap/accordion';
import Card from 'react-bootstrap/card';
import GalaxyMap from './GalaxyMap';
import './Datapad.css';

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

	private bgColor(
		id: string,
	): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | undefined {
		return this.isSelected(id) ? 'primary' : 'dark';
	}

	render() {
		return (
			<Accordion className="Datapad-menu">
				<Card bg={this.bgColor(galaxyMapId)} text="light">
					<Accordion.Toggle
						as={Card.Header}
						eventKey={galaxyMapId}
						onClick={() => this.setSelection(galaxyMapId)}
					>
						Galaxy Map
					</Accordion.Toggle>
				</Card>
				<Card bg={this.bgColor(shopsId)} text="light">
					<Accordion.Toggle as={Card.Header} eventKey={shopsId} onClick={() => this.setSelection(shopsId)}>
						Shops
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={shopsId}>
						<div>
							<Card bg="dark" text="light">
								Equipment
							</Card>
							<Card bg="dark" text="light" border="primary">
								Apothicary
							</Card>
						</div>
					</Accordion.Collapse>
				</Card>
				<Card bg={this.bgColor(contactsId)} text="light">
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
				</Card>
			</Accordion>
		);
	}
}

export default Datapad;
