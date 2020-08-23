import { createMuiTheme } from '@material-ui/core';

/**
 * Theme for use with all material-ui components in the app.
 * TODO: actually set things here as needed.
 */
export const appTheme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

export const background0 = createBackgroundColorAtLevel(0);
export const background1 = createBackgroundColorAtLevel(1);
export const background2 = createBackgroundColorAtLevel(2);
export const background3 = createBackgroundColorAtLevel(3);
export const background4 = createBackgroundColorAtLevel(4);
export const background5 = createBackgroundColorAtLevel(5);

/**
 * Creates a background color based on level
 */
function createBackgroundColorAtLevel(level: number): string {
	const baseLightPercent = 10;
	const lightDelta = 3;
	return `hsla(220, 15%, ${baseLightPercent + level * lightDelta}%, 1)`;
}
