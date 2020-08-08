import { Id } from '../../utilities/DatabaseUtilities';

// TODO: get from schema
export interface Contact {
	_id: Id;
	name: string;
	imageUrl?: string;
	species?: string; // undefined === "Unkown"
	gender?: string; // undefined === "Unkown"
	affiliations?: string[]; // undefined === "None"
	status?: string; // undefined === "Unkown"
}

/**
 * Returns whether or not the contact is a Droid.
 */
export function isDroid(contact: Contact): boolean {
	return contact.species === 'Droid';
}
