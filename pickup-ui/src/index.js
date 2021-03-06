import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import config from './aws-exports'
import Amplify from 'aws-amplify'
Amplify.configure(config)

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
