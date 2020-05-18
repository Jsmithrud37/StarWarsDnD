import React from 'react';
import GalaxyMap from './GalaxyMap';
import './Datapad.css';

/**
 *Datapad main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
const Datapad: React.FC = () => {
	return (
		<div className="Datapad">
			<div className="Datapad-menu">
				<div className="Datapad-menu-item">
					<div>Galaxy Map</div>
					<div>Contacts List</div>
				</div>
			</div>
			<div className="Datapad-view">
				<GalaxyMap />
			</div>
		</div>
	);
};

export default Datapad;
