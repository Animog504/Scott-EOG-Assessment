import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "./CardHeader";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import { Provider, createClient, useQuery, defaultExchanges, subscriptionExchange, useSubscription } from "urql";
import { render } from "react-dom";
import GraphComponent from "./GraphComponent";
import Time from "./Time"
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "./CardComponent"
import { SubscriptionClient } from "subscriptions-transport-ws";
import * as actions from "../store/actions";

const subscriptionClient = new SubscriptionClient(
  "ws://react.eogresources.com/graphql",
  {
    reconnect: true,
    timeout: 20000
  }
);

// not using this for now.
const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    }),
  ],
});

const useStyles = makeStyles({
  card: {
    margin: "5% 5%",
    height: "80%"
  }
});

const DataSubscription = `
subscription DataSubscription{
	newMeasurement{
  	value
  	metric
    unit
    at
  }
}`;


const handleDataSubscription = dispatch => (existingData = {}, newData) => {

  if (newData) {
      existingData[newData.newMeasurement.metric] = newData
  }

  dispatch({ type: actions.NEW_MEASUREMENT_DATA_RECEIVED, newMeasurement: newData.newMeasurement });

}



export default () => {
  

  const selectedMetrics = useSelector(state => state.metrics)

  const classes = useStyles();

  const dispatch = useDispatch();

 useSubscription({
    query: DataSubscription
  }, handleDataSubscription(dispatch))
  
  console.log('Dont rerender')
  // console.log("NW Data: ",data)
  return (
      <Card className={classes.card}>
        <CardHeader title="Dashboard" />
        <SearchBar />
        <GraphComponent selectedMetrics={selectedMetrics}/>
        <CardComponent selectedMetrics={selectedMetrics}/>
      </Card>
  );
};
