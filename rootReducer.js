import { combineReducers } from 'redux';
import { createRouterReducer } from '@lagunovsky/redux-react-router';

import auth from './src/store/ducks/auth';
import resources from './src/store/ducks/resources';

export default (history) =>
  combineReducers({
    router: createRouterReducer(history),

    auth,
    resources
  });
