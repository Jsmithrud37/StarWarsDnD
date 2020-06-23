import React from 'react';
import WidgetBot, { API as BotApi } from '@widgetbot/react-embed';
import './Styling/Messenger.css';

const serverId = '497633093394366464';
const generalChannelId = '497633093394366466';

interface State {
	api: BotApi | undefined;
}

/**
 * Messenger app for the datapad.
 * Simple wrapper around the Discord server.
 */
class MessengerApp extends React.Component {
	public constructor(props: {}) {
		super(props);
	}

	public render(): React.ReactNode {
		return (
			<>
				<WidgetBot
					className="Messenger-app"
					defer={false}
					server={serverId}
					channel={generalChannelId}
				/>
			</>
		);
	}
}

export default MessengerApp;
