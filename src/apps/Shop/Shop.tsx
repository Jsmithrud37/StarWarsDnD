import React, { ReactNode } from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ShopId } from './ShopId';
import { Actions, changeShop } from './Actions';
import { AppState } from './State';
import { connect } from 'react-redux';

/**
 * State parameters used by the Datapad app component.
 */
type Parameters = AppState;

/**
 * Shop {@link https://reactjs.org/docs/render-props.html | Render Props}
 */
type Props = Actions & Parameters;

/**
 *Shop main entry-point. Appears below header in app. Contains side-bar UI for navigating options.
 */
class ShopComponent extends React.Component<Props> {
	public constructor(props: Props) {
		super(props);
	}

	public render(): ReactNode {
		return (
			<div className="Shops">
				{this.renderMenu()}
				{this.renderApp()}
			</div>
		);
	}

	/**
	 * Render the shop-selection menu
	 */
	public renderMenu(): ReactNode {
		return (
			<Tabs
				defaultActiveKey={this.props.shopSelection}
				id="shops-menu"
				onSelect={(shop: unknown) => this.props.changeShop(shop as ShopId)}
			>
				{Object.values(ShopId).map((shop) => (
					<Tab eventKey={shop} title={shop} key={shop} />
				))}
			</Tabs>
		);
	}

	public renderApp(): ReactNode {
		return (
			<Card bg="dark" text="light">
				<Card.Body className="Shops-body">{this.renderInventory()}</Card.Body>
			</Card>
		);
	}

	/**
	 * Renders the inventory view for the indicated shop
	 */
	public renderInventory(): ReactNode {
		switch (this.props.shopSelection) {
			case ShopId.Equipment:
				return this.renderEquipmentInventory();
			case ShopId.Apothicary:
				return this.renderApothicaryInventory();
			default:
				return `Unrecognized ShopId value: ${this.props.shopSelection}`;
		}
	}

	/**
	 * Renders the inventory view for the Equipment shop
	 *
	 * TODO: take table data as input
	 */
	public renderEquipmentInventory(): ReactNode {
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

	/**
	 * Renders the inventory view for the Equipment shop
	 *
	 * TODO: take table data as input
	 */
	public renderApothicaryInventory(): ReactNode {
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

/**
 * {@inheritdoc react-redux/MapStateToPropsParam}
 */
function mapStateToProps(state: AppState): Parameters {
	return {
		shopSelection: state.shopSelection,
	};
}

/**
 * Shop app.
 * Displays shop inventories.
 */
const Shop = connect(mapStateToProps, {
	changeShop,
})(ShopComponent);

export default Shop;
