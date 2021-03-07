import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import Amplify from 'aws-amplify'

Amplify.configure( 
    {
    Auth: {
    "region": "us-east-1",
    "userPoolId": process.env.REACT_APP_USER_POOL_ID,
    "userPoolWebClientId": process.env.REACT_APP_WEBCLIENT_POOL_ID,
    "oauth": {}
    }}
)

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
