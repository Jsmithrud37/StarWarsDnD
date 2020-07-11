/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const proxy = require('http-proxy-middleware');

/**
 * Re-routes http requests to `/.netlify/functions/` in local builds to the local host.
 */
module.exports = function (app) {
	app.use(
		proxy('/.netlify/functions/', {
			target: 'http://localhost:9000/',
			pathRewrite: {
				'^/\\.netlify/functions': '',
			},
		}),
	);
};
