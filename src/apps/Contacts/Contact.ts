import { ThemeColor } from '../../Theming';
import { Id } from '../../utilities/DatabaseUtilities';

// TODO: get from schema
export interface Contact {
	_id: Id;
	name: string;
	species?: string; // undefined === "Unkown"
	gender?: string; // undefined === "Unkown"
	homeworld?: string; // undefined === "Unknown"
	affiliations?: string[]; // undefined === "None"
	status?: string; // undefined === "Unkown"
	bio?: string; // undefined === no bio
	playerCharacter?: boolean; // undefined == false
}

/**
 * Returns whether or not the contact is a Droid.
 */
export function isDroid(contact: Contact): boolean {
	return contact.species === 'Droid';
}

/**
 * TODO
 */
export function getContactCardColor(contact: Contact): ThemeColor {
	return contact.playerCharacter ? ThemeColor.Green : ThemeColor.Blue;
}
