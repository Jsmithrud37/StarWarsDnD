import { Card, CardContent, Button } from '@material-ui/core';
import React from 'react';
import { background2 } from '../../Theming';
import { InventoryItem } from './Inventory';

interface Props {
	item: InventoryItem;
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * Form for adding a new item to an inventory.
 */
class ItemPurchaseDialogue extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<Card
				style={{
					backgroundColor: background2,
					maxWidth: '400px',
				}}
			>
				<CardContent>
					<h3>Purchase Confirmation</h3>
					<br />
					<p>
						Are you sure you wish to purchase <b>{this.props.item.name}</b>?
					</p>
					<p>{`Price: ${this.props.item.cost} credits`}</p>
				</CardContent>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						padding: '15px',
					}}
				>
					<Button fullWidth={false} onClick={() => this.props.onConfirm()}>
						Confirm
					</Button>
					<Button fullWidth={false} onClick={() => this.props.onCancel()}>
						Cancel
					</Button>
				</div>
			</Card>
		);
	}
}

export default ItemPurchaseDialogue;
