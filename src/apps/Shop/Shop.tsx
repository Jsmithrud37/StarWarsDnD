import React, { ReactNode } from 'react';

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
	}

	public render(): ReactNode {
		return <div>TODO: {shopIdToString(this.props.shopSelection)}</div>;
	}
}
