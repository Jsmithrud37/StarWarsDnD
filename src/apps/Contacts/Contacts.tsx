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
import { fetchFromBackendFunction } from '../../utilities/NetlifyUtilities';
// import ReactList from 'react-list';
import './Styling/Contacts.css';

// TODO: get from schema
interface Contact {
	// _id: string,
	name: string;
	race?: string; // undefined === "Unkown"
	gender?: string; // undefined === "Unkown"
	affiliations?: string[]; // undefined === "None"
	status?: string; // undefined === "Unkown"
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

interface State {
	contactsLoaded: boolean;
	contacts?: Contact[]; // TODO
	contactSelectionIndex?: number;
}

export class Contacts extends React.Component<{}, State> {
	public constructor(props: {}) {
		super(props);
		this.state = {
			contactsLoaded: false,
			contacts: undefined,
			contactSelectionIndex: undefined,
		};
	}

	private getLoadedContacts(): Contact[] {
		if (!this.state.contactsLoaded) {
			throw new Error('Contacts not loaded yet.');
		}
		return this.state.contacts as Contact[];
	}

	private getLoadedContactsSelectionIndex(): number {
		if (!this.state.contactsLoaded) {
			throw new Error('Contacts not loaded yet.');
		}
		return this.state.contactSelectionIndex as number;
	}

	private getSelectedContact(): Contact {
		const selectionIndex = this.getLoadedContactsSelectionIndex();
		const contacts = this.getLoadedContacts();
		return contacts[selectionIndex];
	}

	private setContactSelection(newSelectionId: number): void {
		this.setState({
			...this.state,
			contactSelectionIndex: newSelectionId,
		});
	}

	private loadContactsList(contacts: Contact[]): void {
		this.setState({
			...this.state,
			contactsLoaded: true,
			contacts: contacts,
			contactSelectionIndex: 0,
		});
	}

	/**
	 * {@inheritdoc React.Component.componentDidMount}
	 */
	public componentDidMount(): void {
		this.fetchContacts();
	}

	private async fetchContacts(): Promise<void> {
		const getContactsFunction = 'GetAllContacts';
		const response = await fetchFromBackendFunction(getContactsFunction);
		const contacts: Contact[] = response.contacts;

		if (contacts.length > 0) {
			this.loadContactsList(contacts);
		}
	}

	public render(): ReactNode {
		if (this.state.contactsLoaded) {
			return (
				<div className="Contacts">
					{this.renderMenu()}
					{this.renderView()}
				</div>
			);
		}
		return this.renderLoadingScreen();
	}

	private renderLoadingScreen(): ReactNode {
		return <div>Loading contacts...</div>;
	}

	/**
	 * Renders the Contacts app's address-book-style menu.
	 */
	public renderMenu(): ReactNode {
		const contacts = this.getLoadedContacts();
		const selectionIndex = this.getLoadedContactsSelectionIndex();
		return (
			<div className="Contacts-menu">
				{/* <ReactList> */}
				<AccordionMenu
					initialSelectionIndex={selectionIndex}
					onSelectionChange={(newSelectionIndex: number) =>
						this.setContactSelection(newSelectionIndex)
					}
					defaultItemStyle={menuItemStyleDefault}
					selectedItemStyle={menuItemStyleSelected}
					menuItemBuilders={contacts.map(
						(contact) =>
							new SimpleAccordionMenuItemBuilder(
								contact.name,
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
	public renderView(): ReactNode {
		const selectedContact = this.getSelectedContact();
		const raceLink = selectedContact.race
			? `https://starwars.fandom.com/wiki/${selectedContact.race.replace(' ', '_')}/Legends`
			: undefined;

		const affiliationsString = selectedContact.affiliations?.join(', ') ?? 'None';

		return (
			<div className="Contacts-view">
				<Container fluid>
					<Row>
						<Col>
							<Media>
								<img
									width={150}
									height={150}
									src="images/Missing-Contact-Image.png"
									alt="No contact image found"
								/>
								<Media.Body>
									<Row>
										<Col>
											<h3>{selectedContact.name}</h3>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Race: </b>
												{selectedContact.race ? (
													<a
														href={raceLink}
														target="_blank"
														rel="noopener noreferrer"
													>
														{selectedContact.race}
													</a>
												) : (
													'unkown'
												)}
											</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Gender: </b>
												{selectedContact.gender ?? 'Unknown'}
											</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Affiliations: </b>
												{affiliationsString}
											</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Status: </b>
												{selectedContact.status ?? 'Unknown'}
											</p>
										</Col>
									</Row>
								</Media.Body>
							</Media>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}

	renderAffiliationsList(affiliations: string[]): ReactNode {
		return (
			<ul>
				{affiliations.map((affiliation) => {
					return <li key={affiliation}>{affiliation}</li>;
				})}
			</ul>
		);
	}
}
