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

export enum ThemeColor {
	Red = '0',
	Yellow = '60',
	Green = '120',
	Blue = '220',
	Purple = '300',
}

/**
 * Saturation by color
 */
function saturationForColor(color: ThemeColor): string {
	switch (color) {
		case ThemeColor.Red:
			return '50%';
		case ThemeColor.Yellow:
			return '50%';
		case ThemeColor.Green:
			return '20%';
		case ThemeColor.Blue:
			return '25%';
		case ThemeColor.Purple:
			return '20%';
		default:
			throw new Error(`Unrecognized ThemeColor value: ${color}`);
	}
}

/**
 * Creates a content theming color for a given "level" in the application.
 */
export function createContentColorForLevel(colorBase: ThemeColor, level: number): string {
	return createHslaColorAtLevel(colorBase, saturationForColor(colorBase), level);
}

/**
 * Creates a background theming color for a given "level" in the application.
 */
function createBackgroundColorAtLevel(level: number): string {
	return createHslaColorAtLevel('220', '15%', level);
}

/**
 * Creates an HSLA color at a given "level" in the application.
 */
function createHslaColorAtLevel(hue: string, saturation: string, level: number): string {
	const baseLightPercent = 10;
	const lightDelta = 3;
	return `hsla(${hue}, ${saturation}, ${baseLightPercent + level * lightDelta}%, 1)`;
}
