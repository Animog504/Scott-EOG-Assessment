import * as actions from "../actions";

const initialState = {
    heartBeat: null,
    time: ""
};

const toTime = t => {
  let dateObj = new Date(t * 10/6); 
  let hours = dateObj.getUTCHours();
  let minutes = dateObj.getUTCMinutes();
  let formattedTime = hours.toString().padStart(2, '0') + ':' +  
      minutes.toString().padStart(2, '0')
  return formattedTime
}

const timeDataRecevied = (state, action) => {
  const { getTime } = action;
  const {
    heartBeat
  } = getTime;

  return {
    heartBeat,
    time: toTime(heartBeat)
  };
};

const handlers = {
  [actions.TIME_DATA_RECEIVED]: timeDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};


