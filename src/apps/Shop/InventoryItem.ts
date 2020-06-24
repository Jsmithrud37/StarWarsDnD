/**
 * Data entry for an inventory table.
 */
export interface Cell {
	/**
	 * Text to be displayed in the table.
	 */
	text: string;

	/**
	 * Hyperlink to apply to the cell.
	 * If not specified, no link will be applied.
	 */
	link?: string;

	/**
	 * Text to display in pop-over when the cursor is over the cell.
	 * If not specified, no pop-over will be displayed.
	 */
	popOverText?: string;
}

/**
 * Describes the data headers for the inventory.
 * Omits the `name` field (string), `cost` field, and`stock` field, which are required for all
 * inventory tables.
 */
export type InventoryHeader = Array<Cell | string>;

/**
 * Describes a single inventory entry, corresponding to a single type of item.
 */
export interface InventoryItem {
	/**
	 * Name of the item.
	 */
	name: string;

	/**
	 * Data entries associated with the specified headings for the table
	 * (see {@link IntentoryHeader.columns}).
	 */
	otherData: Array<Cell | string>;

	/**
	 * Cost of the item in Galactic Credits.
	 * Must be on [0, ∞).
	 */
	cost: number;

	/**
	 * Quantity of the item in stock.
	 * Must be on [0, ∞).
	 */
	stock: number;
}

/**
 * Inventory table
 */
export class Inventory {
	/**
	 * Header row for the table. `name` and `stock` are included implicitly and should
	 * not be included here.
	 */
	public readonly header: InventoryHeader;

	/**
	 * Data rows for the table. `otherData` must be parallel to `header.columns`.
	 */
	public readonly data: InventoryItem[];

	public constructor(header: InventoryHeader, data: InventoryItem[]) {
		this.header = header;
		this.data = data;
	}
}
