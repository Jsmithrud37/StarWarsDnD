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
import { getCharactersBelongingToPlayer, Player, PlayerKind } from '../../Datapad/Player';

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
	nameFilter?: string;

	/**
	 * Filter to faction.
	 * This filter is based on an exact match, as it is backed by a drop-down menu.
	 * Any contact including a faction which exactly matches this will be matched.
	 * empty string indicates that no filtering should be performed on factions.
	 */
	factionFilter?: string;

	/**
	 * Filter for a particular player character.
	 * The app will only show characters known by the specified character.
	 * Unspecified means to show any character known by *any* of the player's characters.
	 */
	knownByFilter?: string;
}

const initialState: State = {
	nameFilter: undefined,
	factionFilter: undefined,
	knownByFilter: undefined,
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
		if (this.props.player.playerKind !== PlayerKind.DungeonMaster || knownByFilter) {
			let playerCharactersToConsider = getCharactersBelongingToPlayer(
				contacts,
				this.props.player,
			);
			// If no known-by filter is set, we will load characters known by *all* the player's
			// characters.
			if (knownByFilter) {
				playerCharactersToConsider = playerCharactersToConsider.filter(
					(character) =>
						character.name.toLocaleLowerCase() === knownByFilter.toLocaleLowerCase(),
				);
			}
			filteredContacts = filteredContacts.filter((contact) => {
				// An undefined / empty entry for `knownBy` indicates the character is known by everyone.
				if (!contact.knownBy || contact.knownBy.length === 0) {
					return true;
				}

				let known = false;
				const knownCharacters = contact.knownBy;

				for (const knownCharacter of knownCharacters) {
					for (const character of playerCharactersToConsider) {
						if (
							character.name.toLocaleLowerCase() ===
							knownCharacter.toLocaleLowerCase()
						) {
							known = true;
							break;
						}
					}
					if (known) {
						break;
					}
				}
				return known;
			});
		} else {
			// If the user is the DM, and no filter is specified, return all characters
			// (even if not known by any player characters)
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

	private updateNameFilter(newValue?: string): void {
		this.setState({
			...this.state,
			nameFilter: newValue,
		});
	}

	private setFactionFilter(newValue?: string): void {
		console.log(`Faction filter updated to: ${newValue}`);
		this.setState({
			...this.state,
			factionFilter: newValue,
		});
	}

	private setKnownByFilter(newValue?: string): void {
		console.log(`Known-by filter updated to: ${newValue}`);
		this.setState({
			...this.state,
			knownByFilter: newValue,
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

	private renderKnownByFilterDropDown(): ReactNode {
		const playerCharacters = getCharactersBelongingToPlayer(
			this.props.contacts ?? [],
			this.props.player,
		);

		// If the player has no characters, do not show filter menu
		if (!playerCharacters) {
			return React.Fragment;
		}

		const playerCharacterNames = playerCharacters.map((character) => character.name);

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
						onChange={(event) => this.setKnownByFilter(event.target.value as string)}
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
						onChange={(event) => this.setFactionFilter(event.target.value as string)}
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
