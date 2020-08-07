import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import Card from 'react-bootstrap/Card';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataEntry<T = any> {
	public readonly initialValue: T;
	public readonly label: string;
	public readonly elementId: string;

	protected constructor(initialValue: T, label: string, elementId?: string) {
		this.initialValue = initialValue;
		this.label = label;
		this.elementId = elementId ?? label;
	}

	/**
	 * Generates an entry form widget of the appropriate type for the entry type.
	 */
	abstract createForm(
		key: string,
		currentValue: T,
		onUpdate: (key: string, data: T) => void,
	): React.ReactNode;
}

/**
 * DataEntry for strings.
 * Creates a
 */
export class StringEntry extends DataEntry<string> {
	public readonly maxCharacters?: number;

	public constructor(
		initialValue: string,
		label: string,
		elementId?: string,
		maxCharacters?: number,
	) {
		super(initialValue, label, elementId);
		this.maxCharacters = maxCharacters;
	}

	public createForm(
		key: string,
		currentValue: string,
		onUpdate: (key: string, data: string) => void,
	): React.ReactNode {
		return (
			<TextField
				label={this.label}
				id={this.elementId}
				variant="outlined"
				onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
					onUpdate(key, event.target.value)
				}
			>
				{currentValue}
			</TextField>
		);
	}
}

export class BooleanEntry extends DataEntry<boolean> {
	public readonly initialState: boolean;

	public constructor(
		initialValue: boolean,
		label: string,
		elementId?: string,
		initialState?: boolean,
	) {
		super(initialValue, label, elementId);
		this.initialState = initialState ?? false;
	}

	public createForm(
		key: string,
		currentValue: boolean,
		onUpdate: (key: string, data: boolean) => void,
	): React.ReactNode {
		return (
			<FormControlLabel
				control={<Checkbox checked={currentValue} />}
				label={this.label}
				id={this.elementId}
				onChange={(event: React.ChangeEvent<{}>, checked: boolean) =>
					onUpdate(key, checked)
				}
			/>
		);
	}
}

interface Props {
	schemas: Map<string, DataEntry>;
	onSubmit: (data: Map<string, boolean | string | number>) => void;
}

interface State {
	entryState: Map<string, boolean | string | number>;
}

/**
 * Form for adding a new item to an inventory.
 */
class ItemEditForm extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		const initialStateMap = new Map<string, boolean | string | number>();
		props.schemas.forEach((value, key) => {
			initialStateMap.set(key, value.initialValue);
		});

		this.state = {
			entryState: initialStateMap,
		};
	}

	private updateState(name: string, data: boolean | string | number): void {
		const stateMap = new Map<string, boolean | string | number>(this.state.entryState);
		stateMap.set(name, data);
		this.setState({
			...this.state,
			entryState: stateMap,
		});
	}

	public render(): React.ReactNode {
		const childNodes: React.ReactNode[] = [];
		this.props.schemas.forEach((schema, name) => {
			const currentState = this.state.entryState.get(name);
			const child = schema.createForm(name, currentState, (key, data) =>
				this.updateState(key, data),
			);
			childNodes.push(
				<Grid item key={name}>
					{child}
				</Grid>,
			);
		});

		return (
			<Card bg="dark" text="light">
				<Card.Header>Insert a new item</Card.Header>
				<Card.Body>
					<Grid container spacing={3}>
						{childNodes}
					</Grid>
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => this.props.onSubmit(this.state.entryState)}>
						Submit
					</Button>
				</Card.Footer>
			</Card>
		);
	}
}

export default ItemEditForm;
