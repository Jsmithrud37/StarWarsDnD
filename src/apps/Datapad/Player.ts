/**
 * Represents a Player. Corresponds with `PlayerSchema` in the backend code.
 */
export interface Player {
	userName: string;
	playerKind: PlayerKind;
	characters?: string[];

	/**
	 * Notes taken by the player for particular contacts.
	 * Key: contact name
	 * Value: notes
	 */
	contactNotes?: Record<string, string>;
}

/**
 * Kind of player in the campaign
 */
export enum PlayerKind {
	DungeonMaster = 'DungeonMaster',
	Player = 'Player',
	Guest = 'Guest',
}

/**
 * Whether or not the specified player is the Dungeon Master
 */
export function isPlayerDungeonMaster(player: Player): boolean {
	return player.playerKind === PlayerKind.DungeonMaster;
}
