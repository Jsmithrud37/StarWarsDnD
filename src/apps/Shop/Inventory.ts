import { EntryTypes } from '../../shared-components/EditForm';

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
	 * Must be on [0, ∞).
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

	/**
	 * Indicates whether or not the item is considered an "enhanced" item.
	 * undefined === false.
	 */
	enhanced?: boolean;
}

/**
 * Inventory table
 */
export type Inventory = InventoryItem[];

/**
 * Creates an {@link InventoryItem} from its properties
 */
export function createInventoryItem(
	name: string,
	category: string,
	type: string,
	subType: string | undefined,
	rarity: string,
	weight: number,
	cost: number,
	stock: number,
	resourceUrl: string | undefined,
	enhanced: boolean,
): InventoryItem {
	if (name.length === 0) {
		throw new Error('Name must not be empty');
	}
	if (category.length === 0) {
		throw new Error('Category must not be empty');
	}
	if (type.length === 0) {
		throw new Error('Type must not be empty');
	}
	if (rarity.length === 0) {
		throw new Error('Type must not be empty');
	}
	if (weight < 0 || !Number.isFinite(weight)) {
		throw new Error('Weight must be on [0, ∞)');
	}
	if (cost < 0 || !Number.isFinite(cost)) {
		throw new Error('Cost must be on [0, ∞)');
	}
	if (stock < -1 || !Number.isFinite(cost)) {
		throw new Error('Cost must be on [-1, ∞)');
	}

	return {
		name,
		category,
		type,
		subType,
		rarity,
		weight,
		cost,
		stock,
		resourceUrl,
		enhanced,
	};
}

/**
 * Creates an {@link InventoryItem} from a provided mapping from property name to value.
 */
export function createInventoryItemFromProperties(
	itemProperties: Map<string, EntryTypes>,
): InventoryItem {
	const name = itemProperties.get('name');
	if (typeof name !== 'string') {
		throw new Error('"name" was not specified or was not the right type');
	}

	const category = itemProperties.get('category');
	if (typeof category !== 'string') {
		throw new Error('"category" was not specified or was not the right type');
	}

	const type = itemProperties.get('type');
	if (typeof type !== 'string') {
		throw new Error('"type" was not specified or was not the right type');
	}

	const subType = itemProperties.get('subType');
	if (subType !== undefined && typeof subType !== 'string') {
		throw new Error('"rarity" was not the right type');
	}

	const rarity = itemProperties.get('rarity');
	if (typeof rarity !== 'string') {
		throw new Error('"rarity" was not specified or was not the right type');
	}

	const weight = itemProperties.get('weight');
	if (typeof weight !== 'number') {
		throw new Error('"weight" was not specified or was not the right type');
	}

	const cost = itemProperties.get('cost');
	if (typeof cost !== 'number') {
		throw new Error('"cost" was not specified or was not the right type');
	}

	const stock = itemProperties.get('stock');
	if (typeof stock !== 'number') {
		throw new Error('"stock" was not specified or was not the right type');
	}

	const resourceUrl = itemProperties.get('resourceUrl');
	if (resourceUrl !== undefined && typeof resourceUrl !== 'string') {
		throw new Error('"resourceUrl" was not the right type');
	}

	const enhanced = itemProperties.get('enhanced');
	if (typeof enhanced !== 'boolean') {
		throw new Error('"enhanced" was not specified or was not the right type');
	}

	return createInventoryItem(
		name,
		category,
		type,
		subType,
		rarity,
		weight,
		cost,
		stock,
		resourceUrl,
		enhanced,
	);

	// Create new item from provided properties mapping
	const item: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
	itemProperties.forEach((value, key) => {
		item[key] = value;
	});

	return item as InventoryItem;
}
