import { Cell, Inventory, InventoryItem } from '../InventoryItem';

const headerLabels: Array<Cell | string> = ['Type', 'Weight'];

const inventoryItems: InventoryItem[] = [
	{
		name: 'Emergency Battery',
		otherData: ['Mechanical', '5'],
		cost: 70,
		stock: Number.POSITIVE_INFINITY,
	},
	{
		name: 'Basic Computer Spike',
		otherData: ['Utility', '1'],
		cost: 145,
		stock: 5,
	},
];

const inventory = new Inventory(headerLabels, inventoryItems);

/**
 * Get's the Equipment inventory.
 * KLUDGE until we can read from database.
 */
export function getEquipmentInventoryTEMP(): Inventory {
	return inventory;
}
