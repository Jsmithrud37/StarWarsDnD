import React, { ReactNode } from 'react';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { fetchFromBackendFunction } from '../../utilities/NetlifyUtilities';
import { Actions, deselectContact, loadContacts, selectContact } from './Actions';
import { Contact } from './Contact';
import { AppState } from './State';
import './Styling/Contacts.css';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Contacts {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

class ContactsComponent extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	private isSelected(contact: Contact): boolean {
		return contact._id === this.props.contactSelection;
	}

	/**
	 * {@inheritdoc React.Component.componentDidMount}
	 */
	public componentDidMount(): void {
		if (!this.props.contacts) {
			this.fetchContacts();
		}
	}

	private async fetchContacts(): Promise<void> {
		const getContactsFunction = 'GetAllContacts';
		const response = await fetchFromBackendFunction(getContactsFunction);
		const contacts: Contact[] = response.contacts;

		if (contacts.length > 0) {
			this.props.loadContacts(contacts);
		}
	}

	public render(): ReactNode {
		if (this.props.contacts) {
			return (
				<div className="Contacts">
					{/* {this.renderMenu()} */}
					{this.renderContacts()}
				</div>
			);
		}
		return this.renderLoadingScreen();
	}

	private renderLoadingScreen(): ReactNode {
		return (
			<>
				<div>Loading contacts...</div>
				<Spinner animation="border" variant="light"></Spinner>
			</>
		);
	}

	/**
	 * Renders the Contacts app view.
	 * Displays information about the selected contact.
	 */
	public renderContacts(): ReactNode {
		if (!this.props.contacts) {
			throw new Error('Cannot render contacts; none have been loaded.');
		}
		return (
			<CardColumns
				className="Contacts-view"
				onClick={() => {
					this.props.deselectContact();
				}}
			>
				{this.props.contacts.map((contact) => this.renderContact(contact))}
			</CardColumns>
		);
	}

	private renderContact(contact: Contact): React.ReactNode {
		return this.isSelected(contact)
			? this.renderSelectedContact(contact)
			: this.renderNonSelectedContact(contact);
	}

	private renderNonSelectedContact(contact: Contact): React.ReactNode {
		const contactImage = this.renderContactImage(contact, 60);
		const affilliationImage = this.renderAffilliationImage(contact, 60);
		return (
			<Card
				bg="dark"
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onClick={(event: any) => {
					this.props.selectContact(contact._id);
					event.stopPropagation();
				}}
			>
				<Card.Body>
					<Card.Title>
						<Media>
							{contactImage}
							<Media.Body>{contact.name}</Media.Body>
							{affilliationImage}
						</Media>
					</Card.Title>
				</Card.Body>
			</Card>
		);
	}

	private renderSelectedContact(contact: Contact): React.ReactNode {
		const raceLink = this.getRaceLinkUrl(contact);

		let affiliationsString = 'None';
		if (contact.affiliations && contact.affiliations.length > 0) {
			affiliationsString = contact.affiliations?.join(', ');
		}

		const contactImage = this.renderContactImage(contact, 150);
		const affilliationImage = this.renderAffilliationImage(contact, 150);

		return (
			<Card
				bg="dark"
				border="primary"
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onClick={(event: any) => {
					event.stopPropagation();
				}}
			>
				<Card.Header>
					<Card.Title>{contact.name}</Card.Title>
				</Card.Header>
				<Card.Body>
					<Row>
						<Col>
							<Media>
								{contactImage}
								<Media.Body>
									<Row>
										<Col>
											<p>
												<b>Race: </b>
												{contact.race ? (
													<a
														href={raceLink}
														target="_blank"
														rel="noopener noreferrer"
													>
														{contact.race}
													</a>
												) : (
													'Unkown'
												)}
											</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Gender: </b>
												{this.stringOrUnknown(contact.gender)}
											</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Known Affiliations: </b>
												{affiliationsString}
											</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>
												<b>Status: </b>
												{this.stringOrUnknown(contact.status)}
											</p>
										</Col>
									</Row>
								</Media.Body>
								{affilliationImage}
							</Media>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		);
	}

	private getRaceLinkUrl(contact: Contact): string | undefined {
		return contact.race
			? `https://starwars.fandom.com/wiki/${contact.race.replace(' ', '_')}/Legends`
			: undefined;
	}

	private renderContactImage(contact: Contact, height: number): React.ReactNode {
		return this.renderImage(
			contact.imageUrl ?? 'images/Missing-Contact-Image.png',
			height,
			true,
		);
	}

	private stringOrUnknown(value: string | undefined): string {
		return value ?? 'Unkown';
	}

	private renderAffilliationImage(contact: Contact, height: number): React.ReactNode {
		if (!contact.affiliations || contact.affiliations.length === 0) {
			return <></>;
		}
		// TODO: clean this up
		if (contact.affiliations.includes('Stave Squad')) {
			return this.renderImage('images/Stave-Squad.png', height, false);
		} else if (contact.affiliations.includes('Centran Alliance')) {
			return this.renderImage('images/Centran-Alliance.png', height, false);
		} else if (contact.affiliations.includes('Galactic Republic')) {
			return this.renderImage('images/Galactic-Republic.png', height, false);
		} else if (contact.affiliations.includes('True Sith Empire')) {
			return this.renderImage('images/True Sith Empire.png', height, false);
		}
		return <></>;
	}

	private renderImage(url: string, height: number, rounded: boolean): React.ReactNode {
		return <Image rounded={rounded} height={height} src={url} />;
	}
}

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return state;
}

/**
 * Contacts app.
 * Displays known contacts.
 */
const Contacts = connect(mapStateToProps, {
	selectContact,
	deselectContact,
	loadContacts,
})(ContactsComponent);

export default Contacts;
