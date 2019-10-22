import * as actions from "../actions";

const initialState = [];



const newMeasurementDataReceived = (state, action) => {

  const { newMeasurement } = action
  const newState = [...state]
  const newDataPoint = newMeasurement
  const existingDataPointWithSameTimestamp = newState.find(existingDataPoint => existingDataPoint.at === newDataPoint.at)

  if (existingDataPointWithSameTimestamp) {
    existingDataPointWithSameTimestamp[newMeasurement.metric] = newDataPoint.value
  } else {
    newState.push({at: newDataPoint.at, [newMeasurement.metric]: newDataPoint.value})
  }
  return newState
};

const metricDataReceived = (state, action) => {

  const { metricToGet, getMetricData } = action
  const newState = [...state]
  const actualDataThoughForReal = getMetricData[0].measurements
  
  actualDataThoughForReal.forEach(newDataPoint => {
    const existingDataPointWithSameTimestamp = newState.find(existingDataPoint => existingDataPoint.at === newDataPoint.at)
    if (existingDataPointWithSameTimestamp){
      existingDataPointWithSameTimestamp[metricToGet] = newDataPoint.value
    }else{
      newState.push({at: newDataPoint.at, [metricToGet]: newDataPoint.value})
    }
  })
  return newState
}

const handlers = {
  [actions.NEW_MEASUREMENT_DATA_RECEIVED]: newMeasurementDataReceived,
  [actions.METRIC_DATA_RECEIVED]: metricDataReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};


