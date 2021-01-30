import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import ReactMarkdown from 'react-markdown';
import { Character } from '../../characters';

export interface CharacterBioProps {
	character: Character;
}

export class CharacterBio extends React.Component<CharacterBioProps> {
	public constructor(props: CharacterBioProps) {
		super(props);
	}

	public render(): React.ReactNode {
		const bio = this.props.character.bio;
		if (!bio) {
			return this.renderNoBio();
		}
		return this.renderBio(bio);
	}

	private renderBio(bio: string): React.ReactElement {
		return (
			<div
				style={{
					height: '300px',
				}}
			>
				<Scrollbars autoHide={true} autoHeight={false} style={{ height: '100%' }}>
					<div
						style={{
							textAlign: 'left',
						}}
					>
						<ReactMarkdown source={bio} linkTarget="_blank" escapeHtml={false} />
					</div>
				</Scrollbars>
			</div>
		);
	}

	private renderNoBio(): React.ReactElement {
		const divStyle = {
			width: '100%',
			padding: '10px',
		};
		return (
			<div style={divStyle}>
				<p>No bio</p>
			</div>
		);
	}
}
