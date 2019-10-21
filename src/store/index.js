import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas";
import weatherReducer from "./reducers/Weather";
import timeReducer from "./reducers/Time";
import metricsReducer from "./reducers/Metrics";
import dashboardReducer from "./reducers/Dashboard";


export default () => {
  const rootReducer = combineReducers({
    weather: weatherReducer,
    time: timeReducer,
    metrics: metricsReducer,
    dashboard: dashboardReducer
  });

  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = applyMiddleware(sagaMiddleware);
  const store = createStore(rootReducer, composeEnhancers(middlewares));

  sagas.forEach(sagaMiddleware.run);

  return store;
};
 