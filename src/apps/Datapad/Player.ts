import { Contact, getPlayerCharacters } from '../Contacts/Contact';

/**
 * Represents a Player. Corresponds with `PlayerSchema` in the backend code.
 */
export interface Player {
	userName: string;
	playerKind: PlayerKind;
	characters?: string[];
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
 * Gets the characters which are manageable by the given player.
 * DMs can manage all characters.
 * Otherwise, only characters belonging to the signed in player will be returned.
 */
export function getCharactersBelongingToPlayer(characters: Contact[], player: Player): Contact[] {
	// Get all player characters
	const playerCharacters = getPlayerCharacters(characters);

	// Dungeon master can view all characters
	if (player.playerKind === PlayerKind.DungeonMaster) {
		return playerCharacters;
	}

	return playerCharacters.filter((character) => {
		return player.characters?.includes(character.name);
	});
}
