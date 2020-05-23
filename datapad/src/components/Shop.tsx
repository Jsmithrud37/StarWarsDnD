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
	 * If undefined, will use default.
	 * @default {@link Shop.defaultShopSelection}
	 */
	shopId: ShopId | undefined;
}

export class Shop extends React.Component<ShopParameters> {
	defaultShopSelection = ShopId.Equipment;

	public constructor(props: ShopParameters) {
		super(props);
	}

	// TODO: private getter
	private shopId(): ShopId {
		return this.props.shopId ?? this.defaultShopSelection;
	}

	public render(): ReactNode {
		return <div>TODO: {shopIdToString(this.shopId())}</div>;
	}
}
