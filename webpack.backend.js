/* eslint-disable @typescript-eslint/no-var-requires */
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

/**
 * Additional webpack config properties for use with the Netlify backend.
 */
module.exports = {
	plugins: [
		new FilterWarningsPlugin({
			// Works around issues in Mongoose: <https://github.com/Automattic/mongoose/issues/7476>
			exclude: /Critical dependency: the request of a dependency is an expression/,
		}),
	],
};
