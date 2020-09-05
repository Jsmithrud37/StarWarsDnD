/**
 * Describes a single inventory entry, corresponding to a single type of item.
 */
export interface InventoryItem {
	/**
	 * Name of the item.
	 */
	name: string;

	/**
	 * Item category (Armor, Weapon, Adventuring Gear, etc.)
	 */
	category: string;

	/**
	 * Item type (sub-heading of `category`)
	 */
	type: string;

	/**
	 * Item sub-type (sub-heading of `type`)
	 */
	subType?: string;

	/**
	 * Item rarity.
	 * TODO: Enum
	 */
	rarity: string;

	/**
	 * Weight of the item in pounds.
	 */
	weight: number;

	/**
	 * Cost of the item in Galactic Credits.
	 * Must be on [0, ∞).
	 */
	cost: number;

	/**
	 * Quantity of the item in stock.
	 * Must be on [-1, ∞).
	 * -1 is treated as ∞.
	 */
	stock: number;

	/**
	 * Url pointing to a description of the item.
	 * If provided, the `name` field will hyperlink to this.
	 * Otherwise will be linked using the default mechanism.
	 */
	resourceUrl?: string;
}

/**
 * Inventory table
 */
export type Inventory = InventoryItem[];
