import React, { ReactNode } from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/card';

export enum ShopId {
	Equipment,
	Apothicary,
}

/**
 * toString implementation for ShopId, since enums can't be simultaneously
 * number and string backed.
 */
function shopIdToString(id: ShopId): string {
	switch (id) {
		case ShopId.Equipment:
			return 'Equipment';
		case ShopId.Apothicary:
			return 'Apothicary';
		default:
			return `Unrecognized ShopId value: ${id}`;
	}
}

export interface ShopParameters {
	/**
	 * Indicates which shop should be loaded.
	 */
	shopSelection: ShopId;
}

export class Shop extends React.Component<ShopParameters> {
	public constructor(props: ShopParameters) {
		super(props);
		// TODO: load table data based on selected shop
	}

	public render(): ReactNode {
		return (
			<div className="Shops">
				<Card bg="dark" text="light">
					<Card.Header className="Shops-banner">
						<div>{shopIdToString(this.props.shopSelection)}</div>
					</Card.Header>
					<Card.Body className="Shops-body">{this.renderInventory()}</Card.Body>
				</Card>
			</div>
		);
	}

	private renderInventory(): ReactNode {
		const shopId = this.props.shopSelection;
		switch (shopId) {
			case ShopId.Equipment:
				return this.renderEquipmentInventory();
			case ShopId.Apothicary:
				return this.renderApothicaryInventory();
			default:
				return `Unrecognized ShopId value: ${shopId}`;
		}
	}

	// TODO: take table data as component input
	private renderEquipmentInventory(): ReactNode {
		return (
			<Table bordered hover responsive striped variant="dark">
				<thead>
					<tr>
						<th>Item</th>
						<th>Type</th>
						<th>
							Cost (
							<a
								href="https://sw5e.com/rules/phb/equipment#currency"
								target="_blank"
								rel="noopener noreferrer"
							>
								cr
							</a>
							)
						</th>
						<th>Weight (lb)</th>
						<th>Stock</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Emergency Battery</td>
						<td>Mechanical</td>
						<td>70</td>
						<td>5</td>
						<td>∞</td>
					</tr>
					<tr>
						<td>Basic computer spike</td>
						<td>Utility</td>
						<td>145</td>
						<td>1</td>
						<td>5</td>
					</tr>
				</tbody>
			</Table>
		);
	}

	// TODO: take table data as component input
	private renderApothicaryInventory(): ReactNode {
		return (
			<Table bordered hover responsive striped variant="dark">
				<thead>
					<tr>
						<th>Item</th>
						<th>Type</th>
						<th>
							Cost (
							<a
								href="https://sw5e.com/rules/phb/equipment#currency"
								target="_blank"
								rel="noopener noreferrer"
							>
								cr
							</a>
							)
						</th>
						<th>Weight (lb)</th>
						<th>Stock</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Medpac</td>
						<td>Consumable</td>
						<td>300</td>
						<td>1</td>
						<td>∞</td>
					</tr>
					<tr>
						<td>Fine Medpac</td>
						<td>Consumable</td>
						<td>700</td>
						<td>1</td>
						<td>2</td>
					</tr>
				</tbody>
			</Table>
		);
	}
}
