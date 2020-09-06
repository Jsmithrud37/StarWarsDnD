import { DeselectContact, DeselectContactFunction } from './DeselectContact';
import { LoadContacts, LoadContactsFunction } from './LoadContacts';
import { SelectContact, SelectContactFunction } from './SelectContact';
import { UnloadContacts, UnloadContactsFunction } from './UnloadContacts';

/**
 * Collection of action interfaces used by the Contacts app component.
 */
export type ContactsActionTypes = SelectContact | DeselectContact | LoadContacts | UnloadContacts;

/**
 * Collection of action functions supported by the Contacts app component.
 */
export interface Actions {
	/**
	 * {@inheritdoc SelectContactFunction}
	 */
	selectContact: SelectContactFunction;

	/**
	 * {@inheritdoc DeselectContactFunction}
	 */
	deselectContact: DeselectContactFunction;

	/**
	 * {@inheritdoc LoadContactsFunction}
	 */
	loadContacts: LoadContactsFunction;

	/**
	 * {@inheritdoc UnloadContactsFunction}
	 */
	unloadContacts: UnloadContactsFunction;
}
