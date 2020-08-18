import React, { ReactNode } from 'react';
import { HamburgerSqueeze } from 'react-animated-burgers';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';
import Collapse from 'react-bootstrap/Collapse';
import Fade from 'react-bootstrap/Fade';
import Media from 'react-bootstrap/Media';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { ImageContainerShape, renderContactImage } from '../../utilities/ImageUtilities';
import { fetchFromBackendFunction } from '../../utilities/NetlifyUtilities';
import { Actions, deselectContact, loadContacts, selectContact } from './Actions';
import { Contact } from './Contact';
import { AppState } from './State';
import './Styling/Contacts.css';
import { ContactDetails } from './ContactDetails';
import LoadingScreen from '../../shared-components/LoadingScreen';

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
		return <LoadingScreen text="Loading contacts..." />;
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
					<div>
						<ContactDetails contact={contact} />
					</div>
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
