import React from 'react';
import {
	BooleanEntry,
	DataEntry,
	EditForm,
	EntryTypes,
	NumberEntry,
	StringEntry,
} from '../../../shared-components/EditForm';
import { createInventoryItemFromProperties, InventoryItem } from '../Inventory';

// TODO: get as component input
const newItemFormSchemas = new Map<string, DataEntry>([
	['name', new StringEntry('', 'Name', undefined, true, false)],
	['category', new StringEntry('', 'Category', undefined, true, false)],
	['type', new StringEntry('', 'Type', undefined, true, false)],
	['subType', new StringEntry('', 'Sub-Type', undefined, false, false)],
	['rarity', new StringEntry('', 'Rarity', undefined, true, false)],
	['weight', new NumberEntry(0, 'Weight(lb)', undefined, 0, Number.POSITIVE_INFINITY, true)],
	['cost', new NumberEntry(0, 'Cost (cr)', undefined, 0, Number.POSITIVE_INFINITY, false)],
	['stock', new NumberEntry(0, 'Stock', undefined, -1, Number.POSITIVE_INFINITY, false)],
	['resourceUrl', new StringEntry('', 'Custom Resource URL', undefined, false, false)],
	['enhanced', new BooleanEntry(false, 'Enhanced Item')],
]);

interface Props {
	onSubmit: (item: InventoryItem) => void;
	onCancel: () => void;
}

/**
 * Form for creating a new {@link InventoryItem}
 */
export class InsertItemDialogue extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	private submitInsert(itemProperties: Map<string, EntryTypes>): void {
		const item = createInventoryItemFromProperties(itemProperties);
		this.props.onSubmit(item);
	}

	public render(): React.ReactNode {
		return (
			<EditForm
				title="Insert new item"
				schemas={newItemFormSchemas}
				onSubmit={(item) => this.submitInsert(item)}
				onCancel={() => this.props.onCancel()}
			/>
		);
	}
}
