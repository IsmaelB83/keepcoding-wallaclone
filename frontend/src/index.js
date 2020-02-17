// NPM Modules
import React from 'react';
import ReactDOM from 'react-dom';
// Material UI
// Components
import App from './containers/App';
// Own modules
import './utils/i18n';
import 'moment/locale/es';
import 'moment/locale/en-gb';
import * as serviceWorker from './serviceWorker';
// Assets
// CSS
import './index.css';

// Render
ReactDOM.render(<App />, document.getElementById('root'));


/*******************************************************
 *  SERVICE WORKER REGISTRATION --> Push notification  *
 *******************************************************/
const publicVapidKey = 'BCKzHuEXd7u1KviQLVodwYTGgJ6z7iJf-DYtLSNX6FTREky0uxvXCYMwenwp7oXB_3kgEOPGlEO3wYw6XAF2NmY';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

// Check for service workers
if('serviceWorker' in navigator) {
    //send().catch(err => console.error(err));
}

// Register SW, Register push, Send Push
async function send() {
    // Register service worker
    console.log('Registering service worker...');
    const register = await navigator.serviceWorker.register('/serviceWorker.js', {scope: '/'});
    console.log('Service worker registered...');
    
    // Register push
    console.log('Registering push...');
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    }); 
    console.log('Push registered...');

    // Send push notification
    console.log('Sending push...');
    const response = await fetch('/subscribe', { 
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 
            'content-type': 'application/json'
        }
    });
    console.log('Push sent...', response);
}

// Convert vapid key to urlBase64 format
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}