import React, { ReactNode } from 'react';
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
import { Card, Collapse, CardHeader, CardContent, Grid, CircularProgress } from '@material-ui/core';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { background2, background3 } from '../../Theming';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Contacts {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

const contactCardHeaderHeightInPixels = 100;
const contactCardBodyHeightInPixels = 450;

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
		const content = this.props.contacts ? (
			this.renderContacts()
		) : (
			<LoadingScreen text="Loading contacts..." />
		);
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					height: '100%',
					width: '100%',
					backgroundColor: background2,
				}}
			>
				{content}
			</div>
		);
	}

	private renderLoadingScreen(): ReactNode {
		return (
			<>
				<div>Loading contacts...</div>
				<CircularProgress color="primary" />
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
				<Grid
					container
					spacing={2}
					direction="row"
					justify="space-evenly"
					style={{
						padding: 10,
					}}
				>
					{this.props.contacts.map((contact) => {
						return (
							<Grid item key={contact.name}>
								{this.renderContact(contact)}
							</Grid>
						);
					})}
				</Grid>
			</Scrollbars>
		);
	}

	private renderContact(contact: Contact): React.ReactNode {
		const isSelected = this.isSelected(contact);
		const cardHeader = this.renderContactCardHeader(contact);
		return (
			<Card
				onClick={(event) => {
					if (!isSelected) {
						this.props.selectContact(contact._id);
					}
					// Ensures that deselect event capture on container
					// does not immediately deselect the contact.
					event.stopPropagation();
				}}
				raised={isSelected}
				style={{
					minWidth: 360,
					maxWidth: 500,
					overflow: 'hidden',
					backgroundColor: background3,
				}}
			>
				{cardHeader}
				<Collapse in={isSelected}>
					<CardContent>
						<ContactDetails
							contact={contact}
							heightInPixels={contactCardBodyHeightInPixels}
						/>
					</CardContent>
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

		const burgerButton = (
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
		);

		return (
			<CardHeader
				avatar={
					<Collapse in={!isSelected} timeout={150}>
						{contactImage}
					</Collapse>
				}
				title={name}
				action={burgerButton}
				style={{
					height: `${contactCardHeaderHeightInPixels}px`,
				}}
			></CardHeader>
		);
	}

	private renderName(contact: Contact): React.ReactNode {
		return (
			<h5
				style={{
					minWidth: 100,
				}}
			>
				{contact.name}
			</h5>
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
