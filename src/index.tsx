import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Datapad, { reducers } from './apps/Datapad';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';

const dataStore = createStore(reducers);
ReactDOM.render(
	<Provider store={dataStore}>
		<Datapad />
	</Provider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
