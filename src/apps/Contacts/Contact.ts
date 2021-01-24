import { Character } from '../../characters';
import { ThemeColor } from '../../Theming';

export interface Contact extends Character {
	isPlayerCharacter: boolean;
}

/**
 * Gets the appropriate theme color for a Contact Card based on the contact's information.
 * For now, this strictly reflects whether or not the contact is a player character.
 */
export function getContactCardColor(contact: Contact): ThemeColor {
	return contact.isPlayerCharacter ? ThemeColor.Green : ThemeColor.Blue;
}

/**
 * Gets all Contacts that are player characters
 */
export function getPlayerCharacters(contacts: Contact[]): Contact[] {
	return contacts.filter((contact) => contact.isPlayerCharacter);
}
