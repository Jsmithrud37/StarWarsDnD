import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Datapad, { reducers } from './apps/Datapad';
import './index.css';
import * as serviceWorker from './serviceWorker';

const dataStore = createStore(reducers);

const galaxyMapEnabled = true;
const shopsEnabled = false;
const contactsEnabled = true;
const messengerEnabled = true;
const timelineEnabled = false;

ReactDOM.render(
	<Provider store={dataStore}>
		<Datapad
			galaxyMapEnabled={galaxyMapEnabled}
			shopsEnabled={shopsEnabled}
			contactsEnabled={contactsEnabled}
			messengerEnabled={messengerEnabled}
			timelineEnabled={timelineEnabled}
		/>
	</Provider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
