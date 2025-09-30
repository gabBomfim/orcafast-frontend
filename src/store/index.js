import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import createRootReducer from '../../rootReducer.js';
import { feedbackMiddleware } from './middlewares/feedbackMiddleware';
import { authenticatedMiddleware } from './middlewares/authenticatedMiddleware';
import { reduxReset } from './middlewares/reduxReset';

// Create browser history
export const history = createBrowserHistory();

// Create root reducer with history
const rootReducer = createRootReducer(history);

// Create store with middleware
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
      reduxReset,
      feedbackMiddleware,
      authenticatedMiddleware
    ),
    // Enable Redux DevTools Extension if available
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

export default store;
