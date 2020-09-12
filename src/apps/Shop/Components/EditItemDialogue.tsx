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

interface Props {
	itemBeingEdited: InventoryItem;
	onSubmit: (item: InventoryItem) => void;
	onCancel: () => void;
}

/**
 * Form for creating a new {@link InventoryItem}
 */
export class EditItemDialogue extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	private submitEdit(itemProperties: Map<string, EntryTypes>): void {
		if (itemProperties.has('name')) {
			throw new Error('Cannot edit the `name` field of an item.');
		}

		itemProperties.set('name', this.props.itemBeingEdited.name);

		const item = createInventoryItemFromProperties(itemProperties);
		this.props.onSubmit(item);
	}

	private createEditSchemas(): Map<string, DataEntry> {
		const item = this.props.itemBeingEdited;

		return new Map<string, DataEntry>([
			// Do not include name - we do not allow editing of name to guarantee we have
			// a baseline to compare with when modifying the inventory contents
			['category', new StringEntry(item.category, 'Category', undefined, true, false)],
			['type', new StringEntry(item.type, 'Type', undefined, true, false)],
			['subType', new StringEntry(item.subType ?? '', 'Sub-Type', undefined, false, false)],
			['rarity', new StringEntry(item.rarity, 'Rarity', undefined, true, false)],
			[
				'weight',
				new NumberEntry(
					item.weight,
					'Weight(lb)',
					undefined,
					0,
					Number.POSITIVE_INFINITY,
					true,
				),
			],
			[
				'cost',
				new NumberEntry(
					item.cost,
					'Cost (cr)',
					undefined,
					0,
					Number.POSITIVE_INFINITY,
					false,
				),
			],
			[
				'stock',
				new NumberEntry(
					item.stock,
					'Stock',
					undefined,
					-1,
					Number.POSITIVE_INFINITY,
					false,
				),
			],
			[
				'resourceUrl',
				new StringEntry(
					item.resourceUrl ?? '',
					'Custom Resource URL',
					undefined,
					false,
					false,
				),
			],
			['enhanced', new BooleanEntry(item.enhanced ?? false, 'Enhanced Item')],
		]);
	}

	public render(): React.ReactNode {
		return (
			<EditForm
				title="Insert new item"
				schemas={this.createEditSchemas()}
				onSubmit={(item) => this.submitEdit(item)}
				onCancel={() => this.props.onCancel()}
			/>
		);
	}
}
