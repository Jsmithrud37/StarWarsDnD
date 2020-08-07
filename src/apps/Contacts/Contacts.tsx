import { Grid } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Collapse from 'react-bootstrap/Collapse';
import Fade from 'react-bootstrap/Fade';
import Media from 'react-bootstrap/Media';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import {
	ImageContainerShape,
	renderContactImage,
	renderFactionEmblem,
} from '../../utilities/ImageUtilities';
import { fetchFromBackendFunction } from '../../utilities/NetlifyUtilities';
import { Actions, deselectContact, loadContacts, selectContact } from './Actions';
import { Contact, isDroid } from './Contact';
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
			return <div className="Contacts">{this.renderContacts()}</div>;
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
			<Scrollbars
				className="Contacts-view"
				autoHide={true}
				autoHeight={false}
				onClick={() => {
					// TODO: clicking on scroll bar should not deselect items
					this.props.deselectContact();
				}}
			>
				<CardColumns
					style={{
						padding: 10,
					}}
				>
					{this.props.contacts.map((contact) => this.renderContact(contact))}
				</CardColumns>
			</Scrollbars>
		);
	}

	private renderContact(contact: Contact): React.ReactNode {
		const isSelected = this.isSelected(contact);
		const cardHeader = this.renderContactCardHeader(contact);
		const cardBody = this.renderContactCardBody(contact);
		return (
			<Card
				bg="dark"
				border={isSelected ? 'primary' : undefined}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onClick={(event: any) => {
					if (!isSelected) {
						this.props.selectContact(contact._id);
					}
					// Ensures that deselect event capture on container
					// does not immediately deselect the contact.
					event.stopPropagation();
				}}
				style={{
					maxWidth: 500,
					overflow: 'hidden',
				}}
			>
				{cardHeader}
				<Collapse in={isSelected}>
					<div>{cardBody}</div>
				</Collapse>
			</Card>
		);
	}

	private renderContactCardHeader(contact: Contact): React.ReactNode {
		const isSelected = this.isSelected(contact);
		const name = this.renderName(contact);
		const imageHeightInPixels = 60;

		// Only display the contact image when the card is not expanded
		const contactImage = renderContactImage(contact.name, {
			displayHeightInPixels: imageHeightInPixels,
			containerShape: ImageContainerShape.RoundedRectangle,
		});

		return (
			<Card.Header
				style={{
					height: 100,
				}}
			>
				<Media
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Fade in={!isSelected}>{contactImage}</Fade>
					<Media.Body>{name}</Media.Body>
					<HamburgerSqueeze
						barColor="white"
						buttonWidth={30}
						isActive={isSelected}
						toggleButton={
							isSelected
								? () => this.props.deselectContact()
								: // eslint-disable-next-line @typescript-eslint/no-explicit-any
								  (event: any) => {
										// Ensures that deselect event capture on container
										// does not immediately deselect the contact.
										event.stopPropagation();
										this.props.selectContact(contact._id);
								  }
						}
					/>
				</Media>
			</Card.Header>
		);
	}

	private renderContactCardBody(contact: Contact): React.ReactNode {
		const contactImage = renderContactImage(contact.name, {
			displayHeightInPixels: 150,
			containerShape: ImageContainerShape.RoundedRectangle,
		});

		const itemStyle = {
			padding: 5,
		};

		return (
			<Card.Body>
				<Grid container justify="space-between">
					<Grid item style={itemStyle}>
						{contactImage}
					</Grid>
					<Grid item style={itemStyle}>
						{this.renderBasicDetails(contact)}
					</Grid>
					<Grid item style={itemStyle}>
						{this.renderAffilliations(contact)}
					</Grid>
				</Grid>
			</Card.Body>
		);
	}

	private renderName(contact: Contact): React.ReactNode {
		return (
			<div
				style={{
					minWidth: 100,
				}}
			>
				{contact.name}
			</div>
		);
	}

	private renderBasicDetails(contact: Contact): React.ReactNode {
		return (
			<Card
				bg="dark"
				style={{
					minWidth: 200,
				}}
			>
				<Card.Body>
					<>
						{this.renderSpecies(contact)}
						{this.renderGender(contact)}
						{this.renderStatus(contact)}
					</>
				</Card.Body>
			</Card>
		);
	}

	private renderSpecies(contact: Contact): React.ReactNode {
		const speciesLink = this.getSpeciesLinkUrl(contact);
		return (
			<p>
				<b>Species: </b>
				{contact.race ? (
					<a href={speciesLink} target="_blank" rel="noopener noreferrer">
						{contact.race}
					</a>
				) : (
					'Unkown'
				)}
			</p>
		);
	}

	private renderGender(contact: Contact): React.ReactNode {
		// If the contact is a droid, then it does not
		if (isDroid(contact)) {
			return <></>;
		}
		return (
			<p>
				<b>Gender: </b>
				{this.stringOrUnknown(contact.gender)}
			</p>
		);
	}

	private renderStatus(contact: Contact): React.ReactNode {
		return (
			<p>
				<b>Status: </b>
				{this.stringOrUnknown(contact.status)}
			</p>
		);
	}

	private renderAffilliations(contact: Contact): React.ReactNode {
		let cardBody;
		if (contact.affiliations && contact.affiliations.length > 0) {
			const affiliationEntries = contact.affiliations.map((faction) => {
				const affilliationImage = this.renderFactionImage(faction, 30);
				return (
					<tr key={faction}>
						<td>{faction}</td>
						<td>{affilliationImage}</td>
					</tr>
				);
			});
			cardBody = (
				<Card.Body
					style={{
						padding: 5,
						minWidth: 200,
					}}
				>
					<b>Known Affiliations</b>
					<Table variant="dark">{affiliationEntries}</Table>
				</Card.Body>
			);
		} else {
			cardBody = (
				<Card.Body>
					<p>
						<b>Known Affiliations: </b>
						None
					</p>
				</Card.Body>
			);
		}

		return <Card bg="dark">{cardBody}</Card>;
	}

	private getSpeciesLinkUrl(contact: Contact): string | undefined {
		return contact.race
			? `https://starwars.fandom.com/wiki/${contact.race.replace(' ', '_')}`
			: undefined;
	}

	private stringOrUnknown(value: string | undefined): string {
		return value ?? 'unkown';
	}

	private renderFactionImage(
		factionName: string,
		displayHeightInPixels: number,
	): React.ReactNode {
		return renderFactionEmblem(factionName, {
			displayHeightInPixels,
			containerShape: ImageContainerShape.Rectangle,
		});
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
