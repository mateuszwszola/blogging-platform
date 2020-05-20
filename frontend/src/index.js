import React from 'react';
import ReactDOM from 'react-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import AppProviders from 'context/AppProviders';
import ErrorBoundary from 'components/ErrorBoundary';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <>
    <Router>
      <ErrorBoundary>
        <AppProviders>
          <App />
        </AppProviders>
      </ErrorBoundary>
    </Router>
    <ReactQueryDevtools initialIsOpen={false} />
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
