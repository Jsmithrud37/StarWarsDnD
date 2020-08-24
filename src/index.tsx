import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Datapad, { reducers } from './apps/Datapad';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider } from '@material-ui/core';
import { appTheme } from './Theming';

const dataStore = createStore(reducers);

const galaxyMapEnabled = true;
const shopsEnabled = process.env.NODE_ENV !== 'production';
const contactsEnabled = true;
const messengerEnabled = true;
const timelineEnabled = process.env.NODE_ENV !== 'production';

ReactDOM.render(
	<Provider store={dataStore}>
		<MuiThemeProvider theme={appTheme}>
			<Datapad
				galaxyMapEnabled={galaxyMapEnabled}
				shopsEnabled={shopsEnabled}
				contactsEnabled={contactsEnabled}
				messengerEnabled={messengerEnabled}
				timelineEnabled={timelineEnabled}
			/>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
