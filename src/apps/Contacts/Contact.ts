import { ThemeColor } from '../../Theming';
import { Id } from '../../utilities/DatabaseUtilities';

// TODO: get from schema
export interface Contact {
	_id: Id;
	name: string;
	species?: string; // undefined === "Unkown"
	speciesUrl?: string; // undefined => Use default url generation
	gender?: string; // undefined === "Unkown"
	homeworld?: string; // undefined === "Unknown"
	affiliations?: string[]; // undefined === "None"
	status?: string; // undefined === "Unkown"
	bio?: string; // undefined === no bio
	playerCharacter?: boolean; // undefined === false
	knownBy?: string[]; // undefined === known by everyone. Empty === known by no one.
}

/**
 * Returns whether or not the contact is a Droid.
 */
export function isDroid(contact: Contact): boolean {
	return contact.species === 'Droid';
}

/**
 * Returns whether or not the contact is a player character.
 */
export function isPlayerCharacter(contact: Contact): boolean {
	return contact.playerCharacter ?? false;
}

/**
 * Gets only player-character contacts
 */
export function getPlayerCharacters(contacts: Contact[]): Contact[] {
	return contacts.filter((contact) => isPlayerCharacter(contact));
}

/**
 * Gets the appropriate theme color for a Contact Card based on the contact's information.
 * For now, this strictly reflects whether or not the contact is a player character.
 */
export function getContactCardColor(contact: Contact): ThemeColor {
	return contact.playerCharacter ? ThemeColor.Green : ThemeColor.Blue;
}

/**
 * Determines whether or not the contact has any faction affiliations
 */
export function getMaybeFirstFactionAffiliation(contact: Contact): string | undefined {
	return contact.affiliations !== undefined && contact.affiliations.length > 0
		? contact.affiliations[0]
		: undefined;
}
