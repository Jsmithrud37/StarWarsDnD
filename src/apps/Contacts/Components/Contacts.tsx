import React, { ReactNode, ChangeEvent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import RefreshIcon from '@material-ui/icons/Refresh';
import { executeBackendFunction } from '../../../utilities/NetlifyUtilities';
import { Actions } from '../Actions';
import { Contact } from '../Contact';
import { AppState } from '../State';
import {
	Grid,
	IconButton,
	TextField,
	AppBar,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from '@material-ui/core';
import { background2, background3 } from '../../../Theming';
import LoadingScreen from '../../../shared-components/LoadingScreen';
import { ContactCard } from './ContactCard';

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

const initialState: State = {
	nameFilter: '',
	factionFilter: '',
};

export class Contacts extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = initialState;
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
		// Refresh filters
		this.setState(initialState);

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
			<MenuItem key={`faction-filter-option-none`} value={undefined}>
				<em>None</em>
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
						}}
					>
						<div
							style={{
								height: '100%',
								minWidth: '125px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								paddingLeft: '5px',
								paddingRight: '5px',
								textAlign: 'left',
							}}
						>
							<TextField
								type="search"
								value={this.state.nameFilter}
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

						<div
							style={{
								height: '100%',
								minWidth: '175px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								paddingLeft: '5px',
								paddingRight: '5px',
								textAlign: 'left',
							}}
						>
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
				style={{
					float: 'right',
					flex: 1,
				}}
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
						const isSelected = this.isSelected(contact);
						return (
							<Grid item key={contact.name}>
								<ContactCard
									contact={contact}
									selected={isSelected}
									onToggleSelection={() => {
										if (isSelected) {
											this.props.deselectContact();
										} else {
											this.props.selectContact(contact._id);
										}
									}}
								/>
							</Grid>
						);
					})}
				</Grid>
			</Scrollbars>
		);
	}
}
