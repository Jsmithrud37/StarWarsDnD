import { Cell, Inventory, InventoryItem } from '../InventoryItem';

const headerLabels: Array<Cell | string> = ['Type', 'Weight (lb)'];

const inventoryItems: InventoryItem[] = [
	{
		name: 'Medpac',
		otherData: ['Consumable', '1'],
		cost: 300,
		stock: Number.POSITIVE_INFINITY,
	},
	{
		name: 'Fine Medpac',
		otherData: ['Consumable', '1'],
		cost: 700,
		stock: 2,
	},
];

const inventory = new Inventory(headerLabels, inventoryItems);

/**
 * Get's the Equipment inventory.
 * KLUDGE until we can read from database.
 */
export function getApothicaryInventoryTEMP(): Inventory {
	return inventory;
}
