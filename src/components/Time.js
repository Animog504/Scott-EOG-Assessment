import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "./Chip";

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

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
    <Provider value={client}>
      <Time />
    </Provider>
  )
};

const Time = () => {
//   console.log("useSelector",useSelector(getTime))
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
  const { fetching, data, error } = result;
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
