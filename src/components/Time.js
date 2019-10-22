import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { useQuery } from "urql";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "./Chip";

const query = `
query{
    heartBeat
  }
`;

const getTime = state => {
  const { heartBeat, time } = state.time;
  return {
   heartBeat,
   time
  };
};

export default () => {
    // console.log("client:", client)
  return (
      <Time />
  )
};

const Time = () => {

  const dispatch = useDispatch();
  
  const { heartBeat, time } = useSelector(
    getTime
  );

  const [result] = useQuery({
    query,
    variables: {
      heartBeat
    }
  });
  const { data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
    //   console.log("the data:", data)
      const getTime = data;
      dispatch({ type: actions.TIME_DATA_RECEIVED, getTime });
    },
    [dispatch, data, error]
  );

  if (!time) return <LinearProgress />;

  return (
    <Chip
      label={`${time}`}
    />
  );
};
