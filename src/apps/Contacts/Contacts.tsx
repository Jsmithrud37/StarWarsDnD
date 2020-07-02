import React, { ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import {
	AccordionMenu,
	AccordionMenuItemStyle,
	SimpleAccordionMenuItemBuilder,
} from '../../shared-components/AccordionMenu';
// import ReactList from 'react-list';
import './Styling/Contacts.css';

const contactsKludge = [
	'Lucian Kaiet',
	'Arisa Makyr',
	'Xion Reinas',
	'Noir',
	'Giri Shadak',
	"Cidron S'koy",
	'Leanna Tyo',
	'Trom Rakt',
	'Prak Yshyn',
	'Super long name to test trim',
	'Super-long-name-to-test-trim',
	'SuperLongNameToTestTrim',
	'Another name',
	'Another name',
];

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

interface State {
	contacts: string[];
	contactSelection: number;
}

export class Contacts extends React.Component<{}, State> {
	public constructor(props: {}) {
		super(props);
		this.state = {
			contacts: contactsKludge,
			contactSelection: 0,
		};
	}

	setContactSelection(newSelection: number): void {
		this.setState({
			contacts: this.state.contacts,
			contactSelection: newSelection,
		});
	}

	public render(): ReactNode {
		return (
			<div className="Contacts">
				{renderMenu(
					this.state.contacts,
					this.state.contactSelection,
					(newSelectionIndex: number) => this.setContactSelection(newSelectionIndex),
				)}
				{renderView(this.state.contacts[this.state.contactSelection])}
			</div>
		);
	}
}

/**
 * Renders the Contacts app's address-book-style menu.
 */
function renderMenu(
	contacts: string[],
	currentSelection: number,
	selectionCallback: (selection: number) => void,
): ReactNode {
	return (
		<div className="Contacts-menu">
			{/* <ReactList> */}
			<AccordionMenu
				initialSelectionIndex={currentSelection}
				onSelectionChange={selectionCallback}
				defaultItemStyle={menuItemStyleDefault}
				selectedItemStyle={menuItemStyleSelected}
				menuItemBuilders={contacts.map(
					(contact) =>
						new SimpleAccordionMenuItemBuilder(
							contact,
							menuItemStyleDefault,
							menuItemStyleSelected,
						),
				)}
			/>
			{/* </ReactList> */}
		</div>
	);
}

/**
 * Renders the Contacts app view.
 * Displays information about the selected contact.
 */
function renderView(selectedContact: string): ReactNode {
	return (
		<div className="Contacts-view">
			<Container fluid>
				<Row>
					<Col>
						<Media>
							<Media.Body>
								<h3>{selectedContact}</h3>
								<p>TODO: description of contact</p>
							</Media.Body>
							<img
								width={150}
								height={150}
								src="images/Missing-Contact-Image.png"
								alt="Generic placeholder"
							/>
						</Media>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
