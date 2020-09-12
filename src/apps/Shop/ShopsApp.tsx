import { connect } from 'react-redux';
import { changeShop, loadInventory } from './Actions';
import { Shops } from './Components/Shops';
import { AppState } from './State';

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): AppState {
	return state;
}

/**
 * Shops app.
 * Displays shop inventories.
 * Stores inventory information in connected Redux store.
 */
const ShopsApp = connect(mapStateToProps, {
	changeShop,
	loadInventory,
})(Shops);

export default ShopsApp;
