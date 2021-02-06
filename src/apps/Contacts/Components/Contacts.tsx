import React, { ReactNode, ChangeEvent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
// import RefreshIcon from '@material-ui/icons/Refresh';
import { executeBackendFunction, QueryResult } from '../../../utilities/NetlifyUtilities';
import { Actions } from '../Actions';
import { AppState } from '../State';
import {
	Grid,
	// IconButton,
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
import { isPlayerDungeonMaster, Player } from '../../Datapad/Player';
import { Contact, getPlayerCharacters } from '../Contact';
import { NonPlayerCharacter, PlayerCharacter } from '../../../characters';
import Toolbar from './Toolbar';

/**
 * Externally specified props
 */
export interface InputProps {
	/**
	 * Signed in player
	 */
	player: Player;
}

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState & InputProps;

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

	/**
	 * Filter for a particular player character.
	 * The app will only show characters known by the specified character.
	 * Unspecified means to show any character known by *any* of the player's characters.
	 */
	knownByFilter: string;
}

const initialState: State = {
	nameFilter: '',
	factionFilter: '',
	knownByFilter: '',
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
		const contacts = this.props.contacts;
		if (contacts === undefined) {
			throw new Error('Contacts not loaded yet.');
		}

		let filteredContacts = contacts;

		// Filter based on name
		const nameFilter = this.state.nameFilter;
		if (nameFilter) {
			filteredContacts = contacts.filter((contact) =>
				contact.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase()),
			);
		}

		// Filter based on faction
		const factionFilter = this.state.factionFilter;
		if (factionFilter) {
			filteredContacts = filteredContacts.filter((contact) => {
				return contact.affiliations && contact.affiliations.includes(factionFilter);
			});
		}

		// Filter based on player character knowledge
		const knownByFilter = this.state.knownByFilter;
		if (knownByFilter) {
			filteredContacts = filteredContacts.filter((contact) => {
				return contact.knownBy?.includes(knownByFilter) ?? true;
			});
		}

		// TODO: apply other filters as needed

		return filteredContacts;
	}

	/**
	 * Gets the names of all player characters.
	 * Accomplished by knowing that the DM can always see *all* characters,
	 * so by filtering character list to PCs, can be guaranteed to see all names.
	 */
	private getAllPlayerCharacterNamesForDungeonMaster(): string[] {
		const contacts = this.props.contacts;
		if (!contacts) {
			throw new Error('Contacts have not been loaded.');
		}
		const playerCharacters = getPlayerCharacters(contacts);
		return playerCharacters.map((pc) => pc.name);
	}

	private getRepresentedFactions(): string[] {
		const representedFactions = new Set<string>();
		if (this.props.contacts) {
			this.props.contacts.forEach((contact) => {
				if (contact.affiliations) {
					contact.affiliations.forEach((faction: string) => {
						representedFactions.add(faction);
					});
				}
			});
		}
		const representedFactionsArray = Array.from(representedFactions.values());
		return representedFactionsArray.sort((a, b) => a.localeCompare(b));
	}

	private async fetchContacts(): Promise<void> {
		const results: QueryResult<FetchCharactersQueryResult> = isPlayerDungeonMaster(
			this.props.player,
		)
			? await this.fetchAllCharacters()
			: await this.fetchKnownCharacters();

		if (results) {
			const contacts: Contact[] = mapCharactersToContacts(
				results.playerCharacters,
				results.nonPlayerCharacters,
			);
			this.props.loadContacts(contacts);
		} else {
			throw new Error('Failed to load contacts from the server.');
		}
	}

	private fetchAllCharacters(): Promise<QueryResult<FetchCharactersQueryResult>> {
		const getContactsFunction = 'GetAllCharacters';
		return executeBackendFunction<FetchCharactersQueryResult>(getContactsFunction);
	}

	private fetchKnownCharacters(): Promise<QueryResult<FetchCharactersQueryResult>> {
		const getContactsFunction = 'GetKnownCharacters';
		return executeBackendFunction<FetchCharactersQueryResult>(getContactsFunction, [
			{
				name: 'userName',
				value: this.props.player.userName,
			},
		]);
	}

	private updateNameFilter(newValue: string): void {
		this.setState({
			...this.state,
			nameFilter: newValue,
		});
	}

	private updateFactionFilter(newValue: string): void {
		console.log(`Faction filter updated to: ${newValue}`);
		this.setState({
			...this.state,
			factionFilter: newValue,
		});
	}

	private updateKnownByFilter(newValue: string): void {
		console.log(`Known-by filter updated to: ${newValue}`);
		this.setState({
			...this.state,
			knownByFilter: newValue,
		});
	}

	private clearAllFilters(): void {
		this.setState(initialState);
	}

	public render(): ReactNode {
		const contacts = this.props.contacts;

		let renderContent;
		if (contacts) {
			const playerCharacterNames = isPlayerDungeonMaster(this.props.player)
				? this.getAllPlayerCharacterNamesForDungeonMaster()
				: this.props.player.characters ?? [];

			const factions = this.getRepresentedFactions();

			const view = this.renderContacts();
			renderContent = (
				<>
					<Toolbar
						currentNameFilter={this.state.nameFilter}
						onUpdateNameFilter={(newValue: string) => this.updateNameFilter(newValue)}
						currentKnownBySelection={this.state.knownByFilter}
						knownByOptions={playerCharacterNames}
						onUpdateKnownBySelection={(newValue: string) =>
							this.updateKnownByFilter(newValue)
						}
						currentFactionSelection={this.state.factionFilter}
						factionOptions={factions}
						onUpdateFactionSelection={(newValue: string) =>
							this.updateFactionFilter(newValue)
						}
						onClearAllFilters={() => this.clearAllFilters()}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							height: '100%',
							width: '100%',
							flex: '1',
						}}
					>
						{view}
					</div>
				</>
			);
		} else {
			this.fetchContacts();
			renderContent = this.renderLoadingScreen();
		}

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
				{renderContent}
			</div>
		);
	}

	private renderToolbar(): React.ReactNode {
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
						{this.renderNameFilterBox()}
						{this.renderKnownByFilterDropDown()}
						{this.renderFactionFilterDropDown()}
					</div>
					{/* <IconButton
						id="refresh-contacts"
						onClick={() => this.refreshContacts()}
						disabled={this.props.contacts === undefined}
					>
						<RefreshIcon />
					</IconButton> */}
				</div>
			</AppBar>
		);
	}

	private renderKnownByFilterDropDown(): ReactNode {
		const playerCharacterNames = isPlayerDungeonMaster(this.props.player)
			? this.getAllPlayerCharacterNamesForDungeonMaster()
			: this.props.player.characters;

		// If the player has no characters, do not show filter menu
		if (!playerCharacterNames) {
			return React.Fragment;
		}

		const knownByFilterOptions: React.ReactNodeArray = [
			<MenuItem key={`known-by-filter-option-all`} value={undefined}>
				<em>All Characters</em>
			</MenuItem>,
		];
		playerCharacterNames.forEach((characterName) => {
			knownByFilterOptions.push(
				<MenuItem key={`known-by-filter-option-${characterName}`} value={characterName}>
					{characterName}
				</MenuItem>,
			);
		});

		return (
			<div
				style={{
					height: '100%',
					minWidth: '130px', // For the little carrot
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					paddingLeft: '5px',
					paddingRight: '5px',
					textAlign: 'left',
				}}
			>
				<FormControl variant="outlined" size="small">
					<InputLabel id="known-by-filter-label">Known By</InputLabel>
					<Select
						id="known-by-filter-select"
						labelId="known-by-filter-label"
						label="Known By"
						value={this.state.knownByFilter}
						onChange={(event) => this.updateKnownByFilter(event.target.value as string)}
						variant="outlined"
					>
						{knownByFilterOptions}
					</Select>
				</FormControl>
			</div>
		);
	}

	private renderNameFilterBox(): ReactNode {
		return (
			<div
				style={{
					height: '100%',
					minWidth: '100px',
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
					onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
						this.updateNameFilter(event.target.value?.toLocaleLowerCase())
					}
				/>
			</div>
		);
	}

	private renderFactionFilterDropDown(): ReactNode {
		const representedFactions = this.getRepresentedFactions();
		// TODO: base options off of name filter?
		const factionFilterOptions: React.ReactNodeArray = [
			<MenuItem key={`faction-filter-option-none`} value={undefined}>
				<em>All Factions</em>
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
			<div
				style={{
					height: '100%',
					minWidth: '160px', // For the little carrot icon
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					paddingLeft: '5px',
					paddingRight: '5px',
					textAlign: 'left',
				}}
			>
				<FormControl variant="outlined" size="small">
					<InputLabel id="faction-filter-label">Filter Affiliation</InputLabel>
					<Select
						id="faction-filter-select"
						labelId="faction-filter-label"
						label="Filter Affiliation"
						value={this.state.factionFilter}
						onChange={(event) => this.updateFactionFilter(event.target.value as string)}
						variant="outlined"
					>
						{factionFilterOptions}
					</Select>
				</FormControl>
			</div>
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
					spacing={5}
					direction="row"
					justify="space-evenly"
					style={{
						padding: 25,
					}}
				>
					{filteredContacts.map((contact) => {
						const isSelected = this.isSelected(contact);
						return (
							<Grid item key={contact.name} xs={12} sm={9} md={6} lg={4} xl={4}>
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

interface FetchCharactersQueryResult {
	playerCharacters: PlayerCharacter[];
	nonPlayerCharacters: NonPlayerCharacter[];
}

/**
 * Creates a flat list of Contacts from lists of player and non-player characters
 */
function mapCharactersToContacts(
	playerCharacters: PlayerCharacter[],
	nonPlayerCharacters: NonPlayerCharacter[],
): Contact[] {
	const result: Contact[] = [];
	result.push(...playerCharacters.map((pc) => ({ ...pc, isPlayerCharacter: true })));
	result.push(...nonPlayerCharacters.map((pc) => ({ ...pc, isPlayerCharacter: false })));
	return result;
}
