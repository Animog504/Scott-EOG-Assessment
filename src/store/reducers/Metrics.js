import * as actions from "../actions";

const initialState = []

const metricSelected = (state, action) => ([...state, action.metric])

const removeMetric = (state, action) => (state.filter((metric)=> metric !== action.metric))

const handlers = {
    [actions.MEASUREMENT_TYPE_SELECT]: metricSelected,
    [actions.REMOVE_MEASUREMENT]: removeMetric
  };
  
export default (state = initialState, action) => {
    const handler = handlers[action.type];
    if (typeof handler === "undefined") return state;
    return handler(state, action);
};