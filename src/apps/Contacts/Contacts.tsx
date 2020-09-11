import React, { ReactNode, ChangeEvent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { executeBackendFunction } from '../../utilities/NetlifyUtilities';
import { ImageContainerShape, renderContactImage } from '../../utilities/ImageUtilities';
import { Actions, deselectContact, loadContacts, selectContact, unloadContacts } from './Actions';
import { Contact } from './Contact';
import { AppState } from './State';
import './Styling/Contacts.css';
import { ContactDetails } from './ContactDetails';
import {
	Card,
	Collapse,
	CardHeader,
	CardContent,
	Grid,
	IconButton,
	TextField,
	AppBar,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from '@material-ui/core';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { background2, background3 } from '../../Theming';
import RefreshIcon from '@material-ui/icons/Refresh';
import LoadingScreen from '../../shared-components/LoadingScreen';
import ClearIcon from '@material-ui/icons/Clear';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Contacts {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 * State used by the Contacts component. Not stored using Redux.
 */
interface State {
	/**
	 * Filter for contact names.
	 * This filter is based on sub-string matching, as it is backed by a text entry field.
	 * Any contact name including this string will be matched.
	 */
	nameFilter: string;

	/**
	 * Filter to faction.
	 * This filter is based on an exact match, as it is backed by a drop-down menu.
	 * Any contact including a faction which exactly matches this will be matched.
	 * empty string indicates that no filtering should be performed on factions.
	 */
	factionFilter: string;
}

const contactCardHeaderHeightInPixels = 100;
const contactCardBodyHeightInPixels = 450;

const filterBarItemStyle: React.CSSProperties = {
	height: '100%',
	minWidth: '150px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	paddingLeft: '15px',
	paddingRight: '15px',
};

class ContactsComponent extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			nameFilter: '',
			factionFilter: '',
		};
	}

	private isSelected(contact: Contact): boolean {
		return contact._id === this.props.contactSelection;
	}

	private getFilteredContacts(): Contact[] {
		if (this.props.contacts === undefined) {
			throw new Error('Contacts not loaded yet.');
		}

		// Filter based on name
		let filteredContacts = this.props.contacts.filter((contact) =>
			contact.name.toLocaleLowerCase().includes(this.state.nameFilter.toLocaleLowerCase()),
		);

		// Filter based on faction
		if (this.state.factionFilter) {
			filteredContacts = filteredContacts.filter((contact) => {
				return (
					contact.affiliations &&
					contact.affiliations.includes(this.state.factionFilter as string)
				);
			});
		}

		// TODO: apply other filters as needed

		return filteredContacts;
	}

	private getRepresentedFactions(): string[] {
		const representedFactions = new Set<string>();
		if (this.props.contacts) {
			this.props.contacts.forEach((contact) => {
				if (contact.affiliations) {
					contact.affiliations.forEach((faction) => {
						representedFactions.add(faction);
					});
				}
			});
		}
		const representedFactionsArray = Array.from(representedFactions.values());
		return representedFactionsArray.sort((a, b) => a.localeCompare(b));
	}

	private async fetchContacts(): Promise<void> {
		interface FetchContactsQueryResult {
			contacts: Contact[];
		}

		const getContactsFunction = 'GetAllContacts';
		const response = await executeBackendFunction<FetchContactsQueryResult>(
			getContactsFunction,
		);

		if (response) {
			const contacts: Contact[] = response.contacts;
			this.props.loadContacts(contacts);
		} else {
			throw new Error('Failed to load contacts from the server.');
		}
	}

	private refreshContacts(): void {
		// Unload all contacts, will result in this component attempting to reload them from
		// the server.
		this.props.unloadContacts();
	}

	private updateNameFilter(newValue: string): void {
		this.setState({
			...this.state,
			nameFilter: newValue,
		});
	}

	private setFactionFilter(newValue: string): void {
		console.log(`Faction filter updated to: ${newValue}`);
		this.setState({
			...this.state,
			factionFilter: newValue,
		});
	}

	public render(): ReactNode {
		if (this.props.contacts === undefined) {
			this.fetchContacts();
		}

		const toolbar = this.renderToolbar();
		const content = this.props.contacts ? this.renderContacts() : this.renderLoadingScreen();
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					width: '100%',
					backgroundColor: background2,
				}}
			>
				{toolbar}
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						height: '100%',
						width: '100%',
						flex: '1',
					}}
				>
					{content}
				</div>
			</div>
		);
	}

	private renderToolbar(): React.ReactNode {
		const representedFactions = this.getRepresentedFactions();
		// TODO: base options off of name filter?
		const factionFilterOptions: React.ReactNodeArray = [
			<MenuItem key={`faction-filter-option-none`} value={''}>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row-reverse',
					}}
				>
					<ClearIcon />
				</div>
			</MenuItem>,
		];
		representedFactions.forEach((faction) => {
			factionFilterOptions.push(
				<MenuItem key={`faction-filter-option-${faction}`} value={faction}>
					{faction}
				</MenuItem>,
			);
		});

		return (
			<AppBar
				id="contacts-toolbar"
				position="static"
				style={{
					// height: '25px',
					backgroundColor: background3,
					padding: '3px',
				}}
			>
				<div
					id="contacts-toolbar-div"
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<div
						id="contacts-toolbar-filters"
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-around',
						}}
					>
						<div style={filterBarItemStyle}>
							<TextField
								type="search"
								defaultValue={this.state.nameFilter}
								label={`Filter Name`}
								id={`name_filter`}
								variant="outlined"
								multiline={false}
								size="small"
								onChange={(
									event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
								) => this.updateNameFilter(event.target.value.toLocaleLowerCase())}
							/>
						</div>

						<div style={filterBarItemStyle}>
							<FormControl variant="outlined" size="small">
								<InputLabel id="faction-filter-label">
									Filter Affiliation
								</InputLabel>
								<Select
									id="faction-filter-select"
									labelId="faction-filter-label"
									label="Filter Affiliation"
									value={this.state.factionFilter}
									onChange={(event) =>
										this.setFactionFilter(event.target.value as string)
									}
									variant="outlined"
									style={{
										minWidth: '150px',
									}}
								>
									{factionFilterOptions}
								</Select>
							</FormControl>
						</div>
					</div>
					<IconButton
						id="refresh-contacts"
						onClick={() => this.refreshContacts()}
						disabled={this.props.contacts === undefined}
					>
						<RefreshIcon />
					</IconButton>
				</div>
			</AppBar>
		);
	}

	private renderLoadingScreen(): ReactNode {
		return <LoadingScreen text="Loading contacts..." />;
	}

	/**
	 * Renders the Contacts app view.
	 * Displays information about the selected contact.
	 */
	public renderContacts(): ReactNode {
		const filteredContacts = this.getFilteredContacts();

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
					{filteredContacts.map((contact) => {
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
	unloadContacts,
})(ContactsComponent);

export default Contacts;
