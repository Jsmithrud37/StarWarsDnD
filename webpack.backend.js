/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');

/**
 * Additional webpack config properties for use with the Netlify backend.
 */
module.exports = {
	plugins: [
		// Works around issues in Mongoose: <https://github.com/Automattic/mongoose/issues/7476>
		new webpack.ContextReplacementPlugin(/require_optional/),
		new webpack.ContextReplacementPlugin(/mongoose/),
	],
};
