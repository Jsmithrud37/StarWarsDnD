export enum ShopId {
	Equipment = 'Equipment',
	Apothecary = 'Apothecary',
}

/**
 * Creates a {@link ShopId} for the provided string. Ignores case of the string.
 */
export function shopIdFromString(value: string): ShopId {
	if (value.toLowerCase() === 'equipment') {
		return ShopId.Equipment;
	}
	if (value.toLowerCase() === 'apothecary') {
		return ShopId.Apothecary;
	}
	throw new Error(`No ShopId corresponds with "${value}"`);
}
