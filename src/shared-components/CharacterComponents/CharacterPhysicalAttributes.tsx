import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { Character, PhysicalAttribute } from '../../characters';

export interface CharacterPhysicalAttributesProps {
	character: Character;
}

export class CharacterPhysicalAttributes extends React.Component<CharacterPhysicalAttributesProps> {
	public constructor(props: CharacterPhysicalAttributesProps) {
		super(props);
	}

	public render(): React.ReactNode {
		const physicalAttributes = this.props.character.physicalAttributes;
		if (!physicalAttributes) {
			return this.renderNoAttributes();
		}
		return this.renderAttributes(physicalAttributes);
	}

	private renderAttributes(physicalAttributes: PhysicalAttribute[]): React.ReactNode {
		const sortedAttributes = physicalAttributes.sort((a, b) => a.name.localeCompare(b.name));
		return (
			<Table>
				<TableBody>
					{sortedAttributes.map((attribute) => this.renderAttribute(attribute))}
				</TableBody>
			</Table>
		);
	}

	private renderNoAttributes(): React.ReactElement {
		const divStyle = {
			width: '100%',
			padding: '10px',
		};
		return (
			<div style={divStyle}>
				<p>No physical attributes recorded</p>
			</div>
		);
	}

	private renderAttribute(physicalAttribute: PhysicalAttribute): React.ReactElement {
		return (
			<TableRow key={physicalAttribute.name}>
				<TableCell>
					<b>{physicalAttribute.name}:</b>
				</TableCell>
				<TableCell>{physicalAttribute.value}</TableCell>
			</TableRow>
		);
	}
}
