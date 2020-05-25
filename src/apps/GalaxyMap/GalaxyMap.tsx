import React from 'react';
import Iframe from 'react-iframe';

/**
 * Galaxy map viewer
 */
const GalaxyMap: React.FC = () => {
	return (
		<Iframe
			url="https://hbernberg.cartodb.com/viz/76e286d4-fbab-11e3-b014-0e73339ffa50/embed_map?title=false&amp;description=true&amp;search=false&amp;shareable=false&amp;cartodb_logo=false&amp;layer_selector=true&amp;legends=true&amp;scrollwheel=true&amp;fullscreen=true&amp;sublayer_options=1%7C1%7C1%7C1&amp;sql=&amp;zoom=3&amp;center_lat=0&amp;center_lon=0"
			width="100%"
			height="100%"
			id="galaxy-map-frame"
		/>
	);
};

export default GalaxyMap;
