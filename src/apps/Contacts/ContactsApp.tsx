import { connect } from 'react-redux';
import { deselectContact, loadContacts, selectContact } from './Actions';
import { AppState } from './State';
import { Contacts } from './Components/Contacts';

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): AppState {
	return state;
}

/**
 * Contacts app.
 * Displays known contacts.
 */
const ContactsApp = connect(mapStateToProps, {
	selectContact,
	deselectContact,
	loadContacts,
})(Contacts);

export default ContactsApp;
