import React from 'react';
import { Button } from '@material-ui/core';
import AppId from '../AppId';
import { List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TimelineIcon from '@material-ui/icons/Timeline';
import CloseIcon from '@material-ui/icons/Close';
import { background1 } from '../../../Theming';
import { Player, PlayerKind } from '../Player';

/**
 * Determines which apps in the Datapad are enabled. Set by the consumer.
 */
interface DatapadMenuProps {
	/**
	 * Name of the signed-in user.
	 */
	player: Player;

	/**
	 * Selected application.
	 */
	appSelection: AppId;

	/**
	 * Function for signing the user out of the application.
	 */
	logoutFunction: () => void;

	/**
	 * Function to call when the app selection in the menu is changed.
	 */
	onAppSelectionChange: (newSelection: AppId) => void;

	/**
	 * Function to call when the user presses the collapse button on the menu.
	 */
	onMenuCollapse: () => void;
}

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
export class DatapadMenu extends React.Component<DatapadMenuProps> {
	public constructor(props: DatapadMenuProps) {
		super(props);
	}

	private isUserAGuest(): boolean {
		return this.props.player.playerKind === PlayerKind.Guest;
	}

	public render(): React.ReactNode {
		return (
			<List
				component="nav"
				disablePadding={true}
				style={{
					width: `225px`,
					height: '100%',
					backgroundColor: background1,
				}}
			>
				{this.renderWelcome()}
				{this.renderUserRole()}
				{this.renderCharacters()}
				<Divider orientation="horizontal" />
				<Divider orientation="horizontal" />
				<Divider orientation="horizontal" />
				{this.renderAppsList()}
				<Divider orientation="horizontal" />
				<Divider orientation="horizontal" />
				<Divider orientation="horizontal" />
				{this.renderMenuMisc()}
				<Divider orientation="horizontal" />
				<Divider orientation="horizontal" />
				<Divider orientation="horizontal" />
				{this.renderMenuFooter()}
			</List>
		);
	}

	menuTextContainerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: '10px',
		paddingTop: '5px',
	};

	private renderWelcome(): React.ReactNode {
		const player = this.props.player;

		return (
			<ListItem>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'space-around',
					}}
				>
					<div>
						<h5>Welcome {player.userName}!</h5>
					</div>
					<div>
						<IconButton onClick={() => this.props.onMenuCollapse()}>
							<CloseIcon />
						</IconButton>
					</div>
				</div>
			</ListItem>
		);
	}

	private renderUserRole(): React.ReactNode {
		const player = this.props.player;

		if (!player) {
			throw new Error('No player set. Cannot render datapad menu.');
		}

		return (
			<div style={this.menuTextContainerStyle}>
				<h6>
					<b>Role: </b>
					{player.playerKind}
				</h6>
			</div>
		);
	}

	private renderCharacters(): React.ReactNode {
		const player = this.props.player;

		if (!player) {
			throw new Error('No player set. Cannot render datapad menu.');
		}

		const userIsDungeonMaster = player.playerKind === PlayerKind.DungeonMaster;

		let playerCharactersListRender: React.ReactElement;
		if (userIsDungeonMaster) {
			playerCharactersListRender = (
				<List disablePadding dense>
					<ListItem>
						<ListItemText>All</ListItemText>
					</ListItem>
				</List>
			);
		} else {
			playerCharactersListRender = (
				<List disablePadding dense>
					{player.characters ? (
						player.characters.map((character) => {
							return (
								<ListItem key={character}>
									<ListItemText>- {character}</ListItemText>
								</ListItem>
							);
						})
					) : (
						<ListItem key={'none'}>
							<ListItemText>None</ListItemText>
						</ListItem>
					)}
				</List>
			);
		}

		return (
			<div style={this.menuTextContainerStyle}>
				<h6>
					<b>Characters:</b>
				</h6>
				{playerCharactersListRender}
			</div>
		);
	}

	private renderAppsList(): React.ReactNode {
		const userIsGuest = this.isUserAGuest();
		return (
			<div>
				<div style={this.menuTextContainerStyle}>
					<h5>Applications:</h5>
				</div>
				{/* TODO: user details */}
				{/* <Divider orientation="horizontal"></Divider> */}
				{this.createMenuItem(
					'My Profiles',
					<AccountCircleIcon />,
					AppId.Profile,
					userIsGuest,
				)}
				{this.createMenuItem('Galaxy Map', <MapIcon />, AppId.GalaxyMap)}
				{this.createMenuItem('Shops', <ShoppingCartIcon />, AppId.Shops, userIsGuest)}
				{this.createMenuItem('Contacts', <PeopleIcon />, AppId.Contacts)}
				{this.createMenuItem('Timeline', <TimelineIcon />, AppId.Timeline)}
			</div>
		);
	}

	private renderMenuMisc(): React.ReactNode {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					float: 'inline-end',
					padding: '10px',
				}}
			>
				<h5>Other Resources</h5>
				<ListItem>
					<a href="https://sw5e.com/" target="_blank" rel="noopener noreferrer">
						SW5e
					</a>
				</ListItem>
				<ListItem>
					<a
						href="https://drive.google.com/drive/folders/0B0DnV-NrBZTZbHNZb0QzNXRNdE0?usp=sharing"
						target="_blank"
						rel="noopener noreferrer"
					>
						Drive
					</a>
				</ListItem>
				<ListItem>
					<a
						href="https://app.roll20.net/campaigns/details/3130121/starships-and-krayt-dragons-legends-of-the-fallen"
						target="_blank"
						rel="noopener noreferrer"
					>
						Roll20
					</a>
				</ListItem>
			</div>
		);
	}

	private renderMenuFooter(): React.ReactNode {
		return (
			<ListItem>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'start',
						padding: '10px',
					}}
				>
					<Button variant="contained" onClick={() => this.props.logoutFunction()}>
						Log Out
					</Button>
				</div>
			</ListItem>
		);
	}

	private createMenuItem(
		text: string,
		icon: React.ReactElement,
		appId: AppId,
		disabled?: boolean,
	): React.ReactNode {
		return (
			<ListItem
				button
				selected={appId === this.props.appSelection}
				onClick={() => this.props.onAppSelectionChange(appId)}
				key={appId}
				disabled={disabled}
			>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText primary={text} />
			</ListItem>
		);
	}
}
