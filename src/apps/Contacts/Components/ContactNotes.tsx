import React from 'react';
import { Player } from '../../Datapad/Player';
import { Contact } from '../Contact';
import { IconButton, Modal } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ContactNotesProps {
	contact: Contact;
	player: Player;
}

interface ContactNotesState {
	text?: string;
	editing: boolean;
}

export class ContactNotes extends React.Component<ContactNotesProps, ContactNotesState> {
	public constructor(props: ContactNotesProps) {
		super(props);

		let text = undefined;
		const contact = props.player.contactNotes;
		if (contact) {
			text = contact[props.contact.name];
		}

		this.state = {
			text: text,
			editing: false,
		};
	}

	onToggleEditing(newState: boolean): void {
		this.setState({
			...this.state,
			editing: newState,
		});
	}

	onNotesUpdate(textUpdate: string): void {
		// TODO: update backend

		if (!this.props.player.contactNotes) {
			this.props.player.contactNotes = {};
		}
		this.props.player.contactNotes[this.props.contact.name] = textUpdate;

		this.setState({
			...this.state,
			text: textUpdate,
		});
	}

	public render(): React.ReactNode {
		const renderedText = this.state.text ? (
			<div dangerouslySetInnerHTML={{ __html: this.state.text }} />
		) : (
			<p>No notes yet. Click the edit button to add some!</p>
		);
		return (
			<div
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '10px',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					{this.renderEditorModal()}
					{renderedText}
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row-reverse',
					}}
				>
					<IconButton onClick={() => this.onToggleEditing(!this.state.editing)}>
						<EditIcon />
					</IconButton>
				</div>
			</div>
		);
	}

	private renderEditorModal(): React.ReactNode {
		return (
			<Modal open={this.state.editing} onClose={() => this.onToggleEditing(false)}>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
						maxHeight: '100%',
					}}
				>
					<CKEditor
						editor={ClassicEditor}
						data={this.state.text ?? '<p>Take some notes!</p>'}
						onReady={(editor: any) => {
							// You can store the "editor" and use when it is needed.
							console.log('Editor is ready to use!', editor);
							// TODO: do we need to do anything with the editor
						}}
						onChange={(event: any, editor: any) => {
							const data = editor.getData();
							console.log({ event, editor, data });
							this.onNotesUpdate(data);
						}}
						onBlur={(event: any, editor: any) => {
							console.log('Blur.', editor);
						}}
						onFocus={(event: any, editor: any) => {
							console.log('Focus.', editor);
						}}
					/>
				</div>
			</Modal>
		);
	}
}
