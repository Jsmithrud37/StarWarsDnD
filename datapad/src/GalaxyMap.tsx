import React from 'react';
import Iframe from 'react-iframe';

/**
 * Galaxy map viewer
 */
const GalaxyMap: React.FC = () => {
	return <Iframe url="youtube.com" width="450px" height="450px" id="galaxy-map-frame" position="relative" />;
};

export default GalaxyMap;
//<iframe src="" width="100%" height="600" frameborder="0"></iframe>;
