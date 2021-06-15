module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: ['jsdoc', '@typescript-eslint'],
	extends: [
		'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	settings: {
		jsdoc: {
			mode: 'typescript',
			tagNamePreference: {
				arg: 'param',
				return: 'returns',
				augments: 'extends',
			},
		},
		react: {
			version: 'detect',
		},
	},
	rules: {
		'@typescript-eslint/ban-types': 'off', // Maybe investigate later
		'@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
		'@typescript-eslint/no-use-before-define': 'off', // We're above es6, so there is no need for single-pass constraints
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-examples': 'error',
		'jsdoc/check-indentation': 'error',
		'jsdoc/check-param-names': 'error',
		'jsdoc/check-syntax': 'error',
		'jsdoc/check-tag-names': [
			'error',
			{
				definedTags: ['remarks'],
			},
		],
		'jsdoc/check-types': 'error',
		'jsdoc/implements-on-classes': 'error',
		'jsdoc/no-types': 'error',
		'jsdoc/no-undefined-types': 'error',
		'jsdoc/require-description': 'error',
		'jsdoc/require-hyphen-before-param-description': 'error',
		'jsdoc/require-jsdoc': 'error',
		'jsdoc/require-param': 'off',
		'jsdoc/require-param-description': 'error',
		'jsdoc/require-param-name': 'error',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-returns': 'off',
		'jsdoc/require-returns-check': 'error',
		'jsdoc/require-returns-description': 'error',
		'jsdoc/require-returns-type': 'off',
		'jsdoc/valid-types': 'error',
	},
	overrides: [
		{
			files: ['*.yaml', '*.yml'],
			plugins: ['yaml'],
			extends: ['plugin:yaml/recommended'],
		},
	],
};
