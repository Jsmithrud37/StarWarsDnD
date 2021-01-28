import React from 'react';
import { executeBackendFunction, QueryResult } from '../../../utilities/NetlifyUtilities';
import { Actions } from '../Actions';
import { AppState } from '../State';
import { AppBar, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { background2, background3 } from '../../../Theming';
import LoadingScreen from '../../../shared-components/LoadingScreen';
import { isPlayerDungeonMaster, Player } from '../../Datapad/Player';
import { PlayerCharacter } from '../../../characters';

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
 * State parameters used by the Profile app component.
 */
type Parameters = AppState & InputProps;

/**
 * Profile {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

export class Profile extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	private isSelected(character: PlayerCharacter): boolean {
		return character._id === this.props.characterSelection;
	}

	private getSelectedCharacter(): PlayerCharacter {
		if (!this.props.characters || !this.props.selectCharacter) {
			throw new Error('Characters not yet loaded. Cannot query for selected character.');
		}
		for (const character of this.props.characters) {
			if (this.isSelected(character)) {
				return character;
			}
		}
		throw new Error(
			'A character matching the selection was not found. This should not be possible.',
		);
	}

	private async fetchPlayerCharacters(): Promise<void> {
		const results: QueryResult<FetchCharactersQueryResult> = isPlayerDungeonMaster(
			this.props.player,
		)
			? await this.fetchAllPlayerCharacters()
			: await this.fetchOwnedPlayerCharacters();

		if (results) {
			this.props.loadCharacters(results.characters);
		} else {
			throw new Error('Failed to load characters from the server.');
		}
	}

	private fetchAllPlayerCharacters(): Promise<QueryResult<FetchCharactersQueryResult>> {
		return executeBackendFunction<FetchCharactersQueryResult>('GetAllPlayerCharacters');
	}

	private fetchOwnedPlayerCharacters(): Promise<QueryResult<FetchCharactersQueryResult>> {
		return executeBackendFunction<FetchCharactersQueryResult>('GetPlayerCharacters', [
			{
				name: 'userName',
				value: this.props.player.userName,
			},
		]);
	}

	public render(): React.ReactNode {
		const characters = this.props.characters;

		let renderContent;
		if (characters !== undefined) {
			renderContent = this.renderLoaded();
		} else {
			this.fetchPlayerCharacters();
			renderContent = this.renderLoading();
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

	private renderLoading(): React.ReactNode {
		return <LoadingScreen text="Loading character profiles..." />;
	}

	private renderLoaded(): React.ReactNode {
		const toolbar = this.renderToolbar();
		const view = this.renderProfile();
		return (
			<>
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
					{view}
				</div>
			</>
		);
	}

	private renderProfile(): React.ReactNode {
		const selectedCharacter = this.getSelectedCharacter();
		return (
			<div>
				TODO: Profile View
				<br />
				Selection: {selectedCharacter.name}
			</div>
		);
	}

	private renderToolbar(): React.ReactNode {
		return (
			<AppBar
				id="profile-toolbar"
				position="static"
				style={{
					backgroundColor: background3,
					padding: '3px',
				}}
			>
				<div
					id="profile-toolbar-div"
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<div
						id="profile-toolbar-filters"
						style={{
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						{this.renderCharacterSelectionDropDown()}
					</div>
				</div>
			</AppBar>
		);
	}

	private renderCharacterSelectionDropDown(): React.ReactNode {
		const playerCharacters = this.props.characters;

		// If the player has no characters, do not show filter menu
		if (!playerCharacters) {
			return React.Fragment;
		}

		const characterSelectionOptions: React.ReactNodeArray = [];
		playerCharacters.forEach((character) => {
			characterSelectionOptions.push(
				<MenuItem key={`character-selection-option-${character._id}`} value={character._id}>
					{character.name}
				</MenuItem>,
			);
		});

		return (
			<div
				style={{
					height: '100%',
					minWidth: '170px', // For the little carrot
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					paddingLeft: '5px',
					paddingRight: '5px',
					textAlign: 'left',
				}}
			>
				<FormControl variant="outlined" size="small">
					<InputLabel id="character-selection-label">Character Selection</InputLabel>
					<Select
						id="character-selection-select"
						labelId="character-selection-label"
						label="Character Selection"
						value={this.props.characterSelection}
						onChange={(event) =>
							this.props.selectCharacter(event.target.value as string)
						}
						variant="outlined"
					>
						{characterSelectionOptions}
					</Select>
				</FormControl>
			</div>
		);
	}
}

interface FetchCharactersQueryResult {
	characters: PlayerCharacter[];
}
