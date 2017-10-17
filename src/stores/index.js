import {
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux'

import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { intlReducer } from 'react-intl-redux'

import appReducer from '../reducers/App'
import alertsReducer from '../reducers/Alerts'
import routerReducer from '../reducers/Router'
import walletReducer from '../reducers/Wallet'

const logger = createLogger()
const middleware = applyMiddleware(thunk, logger);

export default (data = {}) => {
  const rootReducer = combineReducers({
    app: appReducer,
    intl: intlReducer,
    alerts: alertsReducer,
    router: routerReducer,
    wallet: walletReducer
  })

  return createStore(rootReducer, data, middleware)
}