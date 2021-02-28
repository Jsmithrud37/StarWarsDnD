import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
// import RefreshIcon from '@material-ui/icons/Refresh';
import { executeBackendFunction, QueryResult } from '../../../utilities/NetlifyUtilities';
import { Actions } from '../Actions';
import { AppState } from '../State';
import { Grid } from '@material-ui/core';
import { background2 } from '../../../Theming';
import LoadingScreen from '../../../shared-components/LoadingScreen';
import { ContactCard } from './ContactCard';
import { isPlayerDungeonMaster, Player } from '../../Datapad/Player';
import { Contact, getPlayerCharacters } from '../Contact';
import { getShortNameOrName, NonPlayerCharacter, PlayerCharacter } from '../../../characters';
import Toolbar from './Toolbar';
import { SortBy } from './SortingAndFiltering';

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
	 * Sort order for the contacts
	 */
	sorting: SortBy;

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
	sorting: SortBy.NameAscending,
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

	private getSortedAndFilteredContacts(): Contact[] {
		const rawContacts = this.props.contacts;

		if (rawContacts === undefined) {
			throw new Error('Contacts not loaded yet.');
		}

		const filteredContacts = this.filterContacts(rawContacts);
		const sortedContacts = this.sortContacts(filteredContacts, this.state.sorting);
		return sortedContacts;
	}

	private filterContacts(contacts: Contact[]): Contact[] {
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

	private sortContacts(contacts: Contact[], sorting: SortBy): Contact[] {
		return contacts.sort((a, b) => {
			const aName = getShortNameOrName(a);
			const bName = getShortNameOrName(b);

			const aIsPlayerCharacter = a.isPlayerCharacter;
			const bIsPlayerCharacter = b.isPlayerCharacter;
			switch (sorting) {
				case SortBy.NameAscending:
					return aName.localeCompare(bName);
				case SortBy.NameDescending:
					return -aName.localeCompare(bName);
				case SortBy.NPCsFirst:
					if (aIsPlayerCharacter === bIsPlayerCharacter) {
						return aName.localeCompare(bName);
					} else if (aIsPlayerCharacter) {
						return 1;
					}
					return -1;
				case SortBy.PCsFirst:
					if (aIsPlayerCharacter === bIsPlayerCharacter) {
						return aName.localeCompare(bName);
					} else if (aIsPlayerCharacter) {
						return -1;
					}
					return 1;
				default:
					throw new Error(`Unrecognized SortBy value: '${sorting}'.`);
			}
		});
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

	private updateSorting(newValue: SortBy): void {
		this.setState({
			...this.state,
			sorting: newValue,
		});
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

	public render(): React.ReactNode {
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
						currentSortBy={this.state.sorting}
						onUpdateSortBy={(newValue: SortBy) => this.updateSorting(newValue)}
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

	private renderLoadingScreen(): React.ReactNode {
		return <LoadingScreen text="Loading contacts..." />;
	}

	/**
	 * Renders the Contacts app view.
	 * Displays information about the selected contact.
	 */
	public renderContacts(): React.ReactNode {
		const contacts = this.getSortedAndFilteredContacts();

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
					{contacts.map((contact) => {
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
