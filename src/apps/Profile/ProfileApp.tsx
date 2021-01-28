import { connect } from 'react-redux';
import { loadCharacters, selectCharacter } from './Actions';
import { AppState } from './State';
import { Profile } from './Components/Profile';

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): AppState {
	return state;
}

/**
 * Profile App
 */
const ProfileApp = connect(mapStateToProps, {
	loadCharacters,
	selectCharacter,
})(Profile);

export default ProfileApp;
